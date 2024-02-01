


export type Invitee = {
  email: string;
  name: string;
};

export type SendInvitesRequest = {
  invitees: Invitee[];
  inviteUrl: string;
  inviterName: string;
  inviteMessage: string;
  teamName: string;
};
