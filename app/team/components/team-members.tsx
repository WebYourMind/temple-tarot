import Card from "components/card";
import { Button } from "components/ui/button";
import { UserProfile } from "lib/types";

type Props = {
  members: UserProfile[];
  isAdmin: boolean;
  adminId: string;
  handleRemove: (id: string) => void;
};

const TeamMemberList = ({ members, isAdmin, adminId, handleRemove }: Props) => {
  return (
    <Card>
      <div className="mx-auto max-w-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Team Members</h2>
        <ul className="divide-y">
          {members.map((member: UserProfile) => (
            <li key={member.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-lg font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                {isAdmin && member.id !== adminId && (
                  <Button variant={"outline"} className="mt-2" onClick={() => handleRemove(member.id as string)}>
                    Remove
                  </Button>
                )}
              </div>
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-0.5 text-sm font-medium text-secondary-foreground">
                {member.dominantStyle}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default TeamMemberList;
