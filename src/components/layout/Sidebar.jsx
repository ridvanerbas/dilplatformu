import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Headphones,
  MessageSquare,
  Settings,
  Home,
  LogOut,
  ChevronDown,
  ChevronRight,
  Trophy,
  Globe,
  MessageCircle,
  CreditCard,
  Calendar,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NavItem = ({
  icon,
  label,
  href,
  active = false,
  onClick,
  subItems = [],
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Check if this item or any of its subitems is active
  const isActive =
    active ||
    location.pathname === href ||
    (subItems.length > 0 &&
      subItems.some((item) => location.pathname === item.href));

  // Open the collapsible if a subitem is active
  useEffect(() => {
    if (
      subItems.length > 0 &&
      subItems.some((item) => location.pathname === item.href)
    ) {
      setOpen(true);
    }
  }, [location.pathname, subItems]);

  if (subItems.length > 0) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 py-2 text-left",
              isActive
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => setOpen(!open)}
          >
            {icon}
            <span className="flex-1">{label}</span>
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-10 pr-2">
          <div className="flex flex-col gap-1 pt-1">
            {subItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "text-sm py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href &&
                    "bg-accent/50 text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
      )}
      asChild
      onClick={onClick}
    >
      <Link to={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
};

const Sidebar = ({
  userRole = "admin",
  userName = "Jane Doe",
  userEmail = "jane.doe@example.com",
  userAvatar = "",
  onLogout = () => console.log("Logout clicked"),
}) => {
  const location = useLocation();

  // Navigation items based on user role
  const getNavItems = () => {
    // Student-specific items
    const studentItems = [
      { icon: <Home className="h-5 w-5" />, label: "Ana Sayfa", href: "/" },
      {
        icon: <BookOpen className="h-5 w-5" />,
        label: "Kurslarım",
        href: "/courses",
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Kelime Dağarcığım",
        href: "/vocabulary",
      },
      {
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Cümlelerim",
        href: "/sentences",
      },
      {
        icon: <Headphones className="h-5 w-5" />,
        label: "Dinleme Odası",
        href: "/listening-room",
      },
      {
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Pratik",
        href: "/practice",
        subItems: [
          { label: "Diyaloglar", href: "/practice/dialogues" },
          { label: "Hikayeler", href: "/practice/stories" },
        ],
      },
      {
        icon: <Trophy className="h-5 w-5" />,
        label: "Başarılarım",
        href: "/achievements",
      },
      {
        icon: <MessageCircle className="h-5 w-5" />,
        label: "Forum",
        href: "/forum",
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: "Üyelik",
        href: "/membership",
      },
      {
        icon: <User className="h-5 w-5" />,
        label: "Profilim",
        href: "/profile",
      },
    ];

    // Teacher-specific items
    const teacherItems = [
      { icon: <Home className="h-5 w-5" />, label: "Ana Sayfa", href: "/" },
      {
        icon: <BookOpen className="h-5 w-5" />,
        label: "Kurslarım",
        href: "/courses",
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Dersler",
        href: "/lessons",
      },
      {
        icon: <GraduationCap className="h-5 w-5" />,
        label: "Sorular",
        href: "/questions",
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: "Öğrenciler",
        href: "/students",
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Materyaller",
        href: "/materials",
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: "Program",
        href: "/schedule",
      },
      {
        icon: <MessageCircle className="h-5 w-5" />,
        label: "Forum",
        href: "/forum",
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: "Üyelik",
        href: "/membership",
      },
      {
        icon: <User className="h-5 w-5" />,
        label: "Profilim",
        href: "/profile",
      },
    ];

    // Admin-specific items
    const adminItems = [
      { icon: <Home className="h-5 w-5" />, label: "Ana Sayfa", href: "/" },
      {
        icon: <Users className="h-5 w-5" />,
        label: "Kullanıcı Yönetimi",
        href: "/users",
      },
      {
        icon: <Globe className="h-5 w-5" />,
        label: "İçerik Yönetimi",
        href: "/content",
        subItems: [
          { label: "Diller", href: "/content/languages" },
          { label: "Kurslar", href: "/content/courses" },
          { label: "Sözlük", href: "/content/dictionary" },
          { label: "Materyaller", href: "/content/materials" },
        ],
      },
      {
        icon: <Settings className="h-5 w-5" />,
        label: "Sistem Ayarları",
        href: "/settings",
      },
      {
        icon: <MessageCircle className="h-5 w-5" />,
        label: "Forum",
        href: "/forum",
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: "Üyelik Planları",
        href: "/membership",
      },
      {
        icon: <User className="h-5 w-5" />,
        label: "Profilim",
        href: "/profile",
      },
    ];

    // Return different navigation items based on user role
    switch (userRole) {
      case "student":
        return studentItems;
      case "teacher":
        return teacherItems;
      case "admin":
        return adminItems;
      default:
        return studentItems;
    }
  };

  return (
    <aside className="flex h-full w-[280px] flex-col bg-background border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold">Dil Öğrenme Platformu</h1>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="flex flex-col gap-1">
          {getNavItems().map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>

      <Separator />

      {/* User profile section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{userName}</span>
            <span className="text-xs text-muted-foreground truncate">
              {userEmail}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {userRole}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hesabınızdan çıkış yapın</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profil ayarları</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
