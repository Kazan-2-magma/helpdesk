export enum ROLE {
    ADMIN = "admin", USER="user", AGENT="agent",
}

export const ROLE_LIST = [
    { label: 'Admin', value: ROLE.ADMIN },
    { label: 'Agent', value: ROLE.AGENT },
    { label: 'User', value: ROLE.USER }
    
];
export enum TICKET_STATUS {
    OPEN = "open",
    RESOLVED = "resolved",
    CLOSED = "closed",
}

export const TICKET_STATUS_LIST = [
    { label: 'Open', value: TICKET_STATUS.OPEN,active : false },
    { label: 'Resolved', value: TICKET_STATUS.RESOLVED,active : false },
    { label: 'Closed', value: TICKET_STATUS.CLOSED,active : false }
];