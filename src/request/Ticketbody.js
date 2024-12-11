class Ticketbody {
    constructor(projectKey, summary, descriptionText, issueTypeId, assigneeAccountId) {
        this.fields = {
            project: {
                key: projectKey
            },
            summary: summary,
            description: {
                content: [
                    {
                        content: [
                            {
                                text: descriptionText,
                                type: "text"
                            }
                        ],
                        type: "paragraph"
                    }
                ],
                type: "doc",
                version: 1
            },
            issuetype: {
                id: issueTypeId
            },
            assignee: {
                accountId: assigneeAccountId // Adding the assignee with accountId
            }
        };
    }
}

module.exports = Ticketbody;
