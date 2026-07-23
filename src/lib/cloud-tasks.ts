import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { HouseholdTask, PriorityLevel, RoomId } from "@/lib/tasks";

type TaskRow = {
  category: string;
  created_at: string;
  created_by: string | null;
  due_date: string;
  estimated_minutes: number;
  household_id: string;
  id: string;
  importance: PriorityLevel;
  interval_days: number;
  postponed_until: string | null;
  room_id: string;
  status: "open" | "paused" | "archived";
  title: string;
  updated_at: string;
  urgency: PriorityLevel;
};

type CompletionRow = {
  completed_at: string;
  task_id: string;
};

export type HouseholdMember = {
  createdAt: string;
  role: "owner" | "member";
  userId: string;
};

export type HouseholdInvite = {
  acceptedAt?: string;
  createdAt: string;
  expiresAt: string;
  token: string;
};

type HouseholdMemberRow = {
  created_at: string;
  role: "owner" | "member";
  user_id: string;
};

type HouseholdInviteRow = {
  accepted_at: string | null;
  created_at: string;
  expires_at: string;
  token: string;
};

export async function getOrCreateDefaultHousehold(
  client: SupabaseClient,
  user: User,
) {
  await client.from("profiles").upsert({
    display_name: user.email ?? "Haushalt",
    id: user.id,
  });

  const { data: existingMemberships, error: membershipError } = await client
    .from("household_members")
    .select("household_id")
    .limit(1);

  if (membershipError) {
    throw membershipError;
  }

  const existingHouseholdId = existingMemberships?.[0]?.household_id;

  if (existingHouseholdId) {
    return existingHouseholdId as string;
  }

  const { data: household, error: householdError } = await client
    .from("households")
    .insert({
      created_by: user.id,
      name: "Zuhause",
    })
    .select("id")
    .single();

  if (householdError) {
    throw householdError;
  }

  const householdId = household.id as string;
  const { error: memberError } = await client.from("household_members").insert({
    household_id: householdId,
    role: "owner",
    user_id: user.id,
  });

  if (memberError) {
    throw memberError;
  }

  return householdId;
}

export async function fetchHouseholdMembers(
  client: SupabaseClient,
  householdId: string,
) {
  const { data, error } = await client
    .from("household_members")
    .select("created_at, role, user_id")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as HouseholdMemberRow[] | null ?? []).map((member) => ({
    createdAt: member.created_at,
    role: member.role,
    userId: member.user_id,
  }));
}

export async function addHouseholdMember(
  client: SupabaseClient,
  householdId: string,
  userId: string,
) {
  const { error } = await client.from("household_members").insert({
    household_id: householdId,
    role: "member",
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function removeHouseholdMember(
  client: SupabaseClient,
  householdId: string,
  userId: string,
) {
  const { error } = await client
    .from("household_members")
    .delete()
    .eq("household_id", householdId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function fetchHouseholdInvites(
  client: SupabaseClient,
  householdId: string,
) {
  const { data, error } = await client
    .from("household_invites")
    .select("accepted_at, created_at, expires_at, token")
    .eq("household_id", householdId)
    .is("accepted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  return (data as HouseholdInviteRow[] | null ?? []).map((invite) => ({
    acceptedAt: invite.accepted_at ?? undefined,
    createdAt: invite.created_at,
    expiresAt: invite.expires_at,
    token: invite.token,
  }));
}

export async function createHouseholdInvite(
  client: SupabaseClient,
  householdId: string,
  userId: string,
) {
  const { data, error } = await client
    .from("household_invites")
    .insert({
      created_by: userId,
      household_id: householdId,
    })
    .select("accepted_at, created_at, expires_at, token")
    .single();

  if (error) {
    throw error;
  }

  const invite = data as HouseholdInviteRow;

  return {
    acceptedAt: invite.accepted_at ?? undefined,
    createdAt: invite.created_at,
    expiresAt: invite.expires_at,
    token: invite.token,
  };
}

export async function deleteHouseholdInvite(
  client: SupabaseClient,
  householdId: string,
  token: string,
) {
  const { error } = await client
    .from("household_invites")
    .delete()
    .eq("household_id", householdId)
    .eq("token", token);

  if (error) {
    throw error;
  }
}

export async function acceptHouseholdInvite(
  client: SupabaseClient,
  inviteToken: string,
) {
  const { data, error } = await client.rpc("accept_household_invite", {
    invite_token: inviteToken,
  });

  if (error) {
    throw error;
  }

  return data as string;
}

export async function fetchHouseholdTasks(
  client: SupabaseClient,
  householdId: string,
) {
  const { data: taskRows, error: tasksError } = await client
    .from("tasks")
    .select("*")
    .eq("household_id", householdId)
    .eq("status", "open")
    .order("due_date", { ascending: true });

  if (tasksError) {
    throw tasksError;
  }

  const { data: completionRows, error: completionsError } = await client
    .from("task_completions")
    .select("task_id, completed_at")
    .eq("household_id", householdId)
    .order("completed_at", { ascending: false });

  if (completionsError) {
    throw completionsError;
  }

  const latestCompletionByTask = new Map<string, string>();

  (completionRows as CompletionRow[] | null)?.forEach((completion) => {
    if (!latestCompletionByTask.has(completion.task_id)) {
      latestCompletionByTask.set(
        completion.task_id,
        completion.completed_at.slice(0, 10),
      );
    }
  });

  return (taskRows as TaskRow[] | null ?? []).map((task) =>
    mapTaskRowToHouseholdTask(task, latestCompletionByTask.get(task.id)),
  );
}

export async function createCloudTask(
  client: SupabaseClient,
  householdId: string,
  userId: string,
  task: HouseholdTask,
) {
  const { data, error } = await client
    .from("tasks")
    .insert(mapHouseholdTaskToTaskInsert(task, householdId, userId))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapTaskRowToHouseholdTask(data as TaskRow);
}

export async function updateCloudTask(
  client: SupabaseClient,
  task: HouseholdTask,
) {
  const { data, error } = await client
    .from("tasks")
    .update({
      category: task.category,
      due_date: task.dueDate,
      estimated_minutes: task.estimatedMinutes,
      importance: task.importance,
      interval_days: task.intervalDays,
      postponed_until: task.postponedUntil ?? null,
      room_id: task.roomId,
      title: task.title,
      urgency: task.urgency,
    })
    .eq("id", task.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapTaskRowToHouseholdTask(data as TaskRow, task.completedAt);
}

export async function deleteCloudTask(client: SupabaseClient, taskId: string) {
  const { error } = await client.from("tasks").delete().eq("id", taskId);

  if (error) {
    throw error;
  }
}

export async function completeCloudTask(
  client: SupabaseClient,
  householdId: string,
  userId: string,
  task: HouseholdTask,
  completedAtIso: string,
  nextDueDate: string,
) {
  const { error: completionError } = await client.from("task_completions").insert({
    completed_at: `${completedAtIso}T00:00:00`,
    completed_by: userId,
    household_id: householdId,
    task_id: task.id,
  });

  if (completionError) {
    throw completionError;
  }

  const nextTask = {
    ...task,
    completedAt: completedAtIso,
    dueDate: nextDueDate,
    postponedUntil: undefined,
    status: "open" as const,
  };

  return updateCloudTask(client, nextTask);
}

function mapTaskRowToHouseholdTask(
  task: TaskRow,
  completedAt?: string,
): HouseholdTask {
  return {
    category: task.category,
    completedAt,
    dueDate: task.due_date,
    estimatedMinutes: task.estimated_minutes,
    id: task.id,
    importance: task.importance,
    intervalDays: task.interval_days,
    postponedUntil: task.postponed_until ?? undefined,
    roomId: task.room_id as RoomId,
    status: "open",
    title: task.title,
    urgency: task.urgency,
  };
}

function mapHouseholdTaskToTaskInsert(
  task: HouseholdTask,
  householdId: string,
  userId: string,
) {
  return {
    category: task.category,
    created_by: userId,
    due_date: task.dueDate,
    estimated_minutes: task.estimatedMinutes,
    household_id: householdId,
    importance: task.importance,
    interval_days: task.intervalDays,
    postponed_until: task.postponedUntil ?? null,
    room_id: task.roomId,
    status: "open",
    title: task.title,
    urgency: task.urgency,
  };
}
