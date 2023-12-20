import Card from "components/card";

const TeamMemberList = ({ members }: any) => {
  return (
    <Card>
      <div className="mx-auto max-w-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Team Members</h2>
        <ul className="divide-y">
          {members.map((member: any, index: string) => (
            <li key={index} className="flex items-center justify-between py-4">
              <div>
                <p className="text-lg font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-0.5 text-sm font-medium text-secondary-foreground">
                {member.thinkingStyle}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default TeamMemberList;
