import { db } from "@repo/db/db";

class UserTool {
    async execute({ userId, action, input }: any) {
        console.log(`[UserTool] Executing action: ${action}`, input);

        if (action === "create_user") {
            const { name, email, password } = input;

            if (!name || !email || !password) {
                console.error("[UserTool] Missing required fields: name, email, or password");
                return { success: false, error: "Missing required fields" };
            }

            try {
                // Testing purposes: save password to passwordHash field directly
                const newUser = await db.user.create({
                    data: {
                        name,
                        email,
                        passwordHash: password
                    }
                });

                console.log("[UserTool] Successfully created user!", newUser.id);
                return { success: true, user: newUser };
            } catch (error: any) {
                console.error("[UserTool] Error creating user:", error);
                return { success: false, error: error.message };
            }
        }

        console.error(`[UserTool] Unknown action: ${action}`);
        return { success: false, error: "Unknown action" };
    }
}

export const userTool = new UserTool();
