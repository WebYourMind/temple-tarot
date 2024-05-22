"use client";

import { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import PaginationComponent from "../readings/components/pagination-component";

const ReferralCodesPage = () => {
  const [referralCodes, setReferralCodes] = useState([]);
  const [newCode, setNewCode] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [codesPerPage] = useState(5);

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const fetchReferralCodes = async () => {
    try {
      const response = await fetch("/api/referrals"); // Replace with actual userId
      const data = await response.json();
      // @ts-ignore
      setReferralCodes(data);
    } catch (error) {
      console.error("Error fetching referral codes:", error);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: 1 }), // Replace with actual userId
      });

      const data = await response.json();
      // @ts-ignore
      setNewCode(data.code);
      toast.success("New referral code generated!");
      fetchReferralCodes();
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error("Failed to generate referral code.");
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredCodes = referralCodes.filter((code) => {
    if (filter === "pending") return !code.used;
    if (filter === "accepted") return code.used;
    return true;
  });

  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = filteredCodes.slice(indexOfFirstCode, indexOfLastCode);

  const handlePageChange = (newPage) => {
    if (newPage !== "...") {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(filteredCodes.length / codesPerPage);
  const paginate = (currentPage, pageCount, delta = 2) => {
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < pageCount - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (pageCount > 1) {
      range.push(pageCount);
    }

    return range;
  };

  const pages = paginate(currentPage, totalPages);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Referral Codes</h1>
      <Button onClick={generateReferralCode} className="mb-4">
        Generate New Code
      </Button>
      {newCode && (
        <div className="mb-4 rounded-md p-4">
          <p className="text-lg font-bold">New Referral Code: {newCode}</p>
          <CopyToClipboard text={newCode}>
            <Button className="mt-2">Copy Code</Button>
          </CopyToClipboard>
        </div>
      )}
      <div className="mb-4">
        <Select onValueChange={handleFilterChange} value={filter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-bold">Your Referral Codes</h2>
        {currentCodes.length > 0 ? (
          currentCodes.map((code) => (
            <div key={code.id} className="mb-4 rounded-md p-4 shadow">
              <p className="text-lg font-bold">Code: {code.code}</p>
              <p>Status: {code.used ? "Accepted" : "Pending"}</p>
              {code.used && <p>Used by: {code.used_by}</p>}
              {code.used && <p>Used on: {new Date(code.used_at).toLocaleDateString()}</p>}
              <CopyToClipboard text={code.code}>
                <Button className="mt-2">Copy Code</Button>
              </CopyToClipboard>
            </div>
          ))
        ) : (
          <p className="text-muted">You have no referral codes yet.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="my-8">
          <PaginationComponent pages={pages} page={currentPage} totalPages={totalPages} onPaginate={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default ReferralCodesPage;
