'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ISearchParams } from '@/types';

interface Props {
  onSearch: (params: Partial<ISearchParams>) => void;
}

export function BillingSearchForm({ onSearch }: Props) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [searchField, setSearchField] = useState<ISearchParams['searchField']>('name');
  const [searchValue, setSearchValue] = useState('');
  const [status, setStatus] = useState<ISearchParams['status']>('all');

  const handleSearch = () => {
    onSearch({
      fromDate: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      toDate: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      searchField,
      searchValue,
      status,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'yyyy-MM-dd')} ~ {format(date.to, 'yyyy-MM-dd')}
                  </>
                ) : (
                  format(date.from, 'yyyy-MM-dd')
                )
              ) : (
                <span>기간 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select value={searchField} onValueChange={(value: ISearchParams['searchField']) => setSearchField(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="검색 조건" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">사업자명</SelectItem>
            <SelectItem value="code">사업자번호</SelectItem>
            <SelectItem value="ceo">대표자</SelectItem>
            <SelectItem value="email">이메일</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />

        <Select value={status} onValueChange={(value: ISearchParams['status']) => setStatus(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="발송 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="not_sent">미발송</SelectItem>
            <SelectItem value="success">발송 성공</SelectItem>
            <SelectItem value="fail">발송 실패</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          검색
        </Button>
      </div>
    </div>
  );
} 