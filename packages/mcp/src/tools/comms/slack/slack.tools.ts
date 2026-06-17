class SlackTool {
    execute ({ userId, action, input } : any) {
        console.log(userId, action, input);
    }
}

export const slackTool = new SlackTool();