import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Car } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url: string;
}

export default function Authenticated({
  header,
  children,
  items,
}: PropsWithChildren<{ header?: ReactNode, items: BreadcrumbItem[] }>) {
  const data = [
    {
      title: "Dashboard",
      url: "dashboard",
    },
    {
      title: "Parking Areas",
      url: "parking.area.index",
    },
  ];

  const user = usePage().props.auth.user;

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  return (
    <SidebarProvider>

      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Car className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">TARCAR</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className='h-full'>
            <SidebarGroupContent className='h-full flex flex-col justify-between'>
              <SidebarMenu className='h-full'>
                {data.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={route().current(item.url)}>
                      <a href={route(item.url)}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <SidebarMenu className='w-full'>
                <SidebarMenuItem>

                  <DropdownMenu>
                    <DropdownMenuTrigger className='w-full'>

                      {user.name}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="min-w-56 rounded-lg"
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Dropdown.Link
                            href={route('profile.edit')}
                          >
                            Profile
                          </Dropdown.Link>
                          <Dropdown.Link
                            href={route('logout')}
                            method="post"
                            as="button"
                          >
                            Log Out
                          </Dropdown.Link>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className='h-screen'>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden px-2 md:block" />}
                    {isLast ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage><span className="font-semibold">{item.label}</span></BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (

                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={item.url}>
                          {item.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className='h-full'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
