"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IInvoiceFileSearchParams } from "@/types";

interface InvoiceFileSearchProps {
  searchParams: IInvoiceFileSearchParams;
  onSearch: (params: Partial<IInvoiceFileSearchParams>) => void;
}

export default function InvoiceFileSearch({ searchParams, onSearch }: InvoiceFileSearchProps) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [billingMonth, setBillingMonth] = useState<Date>();

  const handleSearch = () => {
    const params: Partial<IInvoiceFileSearchParams> = {
      searchField: searchParams.searchField,
      searchValue: searchParams.searchValue,
      dateType: searchParams.dateType,
    };

    if (searchParams.dateType === "sent") {
      if (fromDate) params.fromDate = format(fromDate, "yyyy-MM-dd");
      if (toDate) params.toDate = format(toDate, "yyyy-MM-dd");
    } else {
      if (billingMonth) params.billingMonth = format(billingMonth, "yyyy-MM");
    }

    onSearch(params);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex gap-4">
        <Select
          value={searchParams.dateType}
          onValueChange={(value: "sent" | "billing") =>
            onSearch({ dateType: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="날짜 기준 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sent">발송일</SelectItem>
            <SelectItem value="billing">청구월</SelectItem>
          </SelectContent>
        </Select>

        {searchParams.dateType === "sent" ? (
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? (
                    format(fromDate, "PPP", { locale: ko })
                  ) : (
                    "시작일 선택"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
            <span>~</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? (
                    format(toDate, "PPP", { locale: ko })
                  ) : (
                    "종료일 선택"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !billingMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {billingMonth ? (
                  format(billingMonth, "yyyy년 MM월", { locale: ko })
                ) : (
                  "청구월 선택"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={billingMonth}
                onSelect={setBillingMonth}
                locale={ko}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex gap-4">
        <Select
          value={searchParams.searchField}
          onValueChange={(value: "name" | "code" | "ceo" | "branch") =>
            onSearch({ searchField: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="검색 조건 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">사업자명</SelectItem>
            <SelectItem value="code">사업자번호</SelectItem>
            <SelectItem value="ceo">대표자</SelectItem>
            <SelectItem value="branch">지점명</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="검색어를 입력하세요"
          value={searchParams.searchValue}
          onChange={(e) => onSearch({ searchValue: e.target.value })}
          className="flex-1"
        />

        <Button onClick={handleSearch}>검색</Button>
      </div>
    </div>
  );
} 