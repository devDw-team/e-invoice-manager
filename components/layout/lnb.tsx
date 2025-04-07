'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface INavItem {
  title: string
  href?: string
  children?: INavItem[]
}

const navItems: INavItem[] = [
  {
    title: '사업자 관리',
    children: [
      {
        title: '사업자 관리',
        href: '/vendors',
      },
      {
        title: '담당자 관리',
        href: '/vendors/contacts',
      },
      {
        title: '사업자 청구서 양식 관리',
        href: '/vendor-forms',
      },
      {
        title: '공급자 정보 관리',
        href: '/vendor-forms/supplier-info',
      },
    ],
  },
  {
    title: '청구서 관리',
    children: [
      {
        title: '청구서 발송 관리',
        href: '/billing',
      },
      {
        title: '청구서 파일 관리',
        href: '/billing/files',
      },
    ],
  },
]

export function LNB() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-6 px-4 text-lg font-semibold">e-청구서 관리</h2>
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <h2 className="px-4 py-2 font-medium">{item.title}</h2>
                {item.children?.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href || '#'}
                    className={cn(
                      "block px-8 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === child.href && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 