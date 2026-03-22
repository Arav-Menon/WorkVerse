export function getRoomId_sort(currentUserId: string, targetUserId: string) {
    return [currentUserId, targetUserId].sort().join(":");
}