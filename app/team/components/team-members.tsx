import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Card from "components/card";
import { Button } from "components/ui/button";
import { UserProfile } from "lib/types";
import { useState } from "react";

type Props = {
  members: UserProfile[];
  isAdmin: boolean;
  adminId: string;
  handleRemove: (id: string) => void;
};

const TeamMemberList = ({ members, isAdmin, adminId, handleRemove }: Props) => {
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 10; // Number of items per page

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <Card>
      <div className="mx-auto max-w-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Team Members</h2>
        <ul className="divide-y">
          {currentMembers.map((member: UserProfile) => (
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
              <span
                className={`inline-flex items-center rounded-full bg-muted px-3 py-0.5 text-sm font-medium text-secondary-foreground ${
                  member.dominantStyle ? "text-green-900" : "text-red-900"
                }`}
              >
                {member.dominantStyle ? "Assessment Complete" : "Assessment Pending"}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex w-full justify-between">
          <Button variant={"outline"} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            <ArrowLeftIcon />
          </Button>
          <Button
            variant={"outline"}
            disabled={indexOfLastItem >= members.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberList;
