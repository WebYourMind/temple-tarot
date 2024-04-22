import React from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationEllipsis } from "components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "components/ui/button";

function PaginationComponent({ pages, page, totalPages, onPaginate }) {
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <Button variant="outline" onClick={() => onPaginate(page - 1)} disabled={page === 1}>
            <ChevronLeft className="mr-2" />
            Previous
          </Button>
          {/* <PaginationPrevious onClick={() => onPaginate(page - 1)} disabled={page === 1} /> */}
        </PaginationItem>

        {/* Dynamically generated page numbers */}
        {pages.map((p, index) => (
          <PaginationItem key={index}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <Button
                onClick={() => onPaginate(p)}
                // isActive={page === p}
                variant={page === p ? "secondary" : "outline"}
                className={page === p ? "active" : ""}
              >
                {p}
              </Button>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <Button variant="outline" onClick={() => onPaginate(page + 1)} disabled={page === totalPages}>
            Next
            <ChevronRight className="ml-2" />
          </Button>
          {/* <PaginationNext onClick={() => onPaginate(page + 1)} disabled={page === totalPages} /> */}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
