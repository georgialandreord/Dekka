import { ChevronRight, Home } from "lucide-react";
import { Link, useParams, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

type BreadcrumbItemType = {
  label: string;
  href: string;
  isCurrent: boolean;
};

type BreadcrumbDisplayItem = BreadcrumbItemType | { type: "ellipsis" };

export default function BreadcrumbNavigation() {
  const params = useParams();
  const location = useLocation();

  // Get the wildcard path from params
  const folderPath = params["*"] || "";

  // Build breadcrumb items
  const buildBreadcrumbItems = () => {
    const items = [
      {
        label: "My Folders",
        href: "/dashboard/folders",
        isCurrent: !folderPath,
      },
    ];

    if (folderPath) {
      // Split the path into segments
      const segments = folderPath.split("/").filter(Boolean);

      // Build cumulative paths for each segment
      let cumulativePath = "";
      segments.forEach((segment, index) => {
        cumulativePath += `/${segment}`;
        const isLast = index === segments.length - 1;

        items.push({
          label: segment,
          href: `/dashboard/folders${cumulativePath}`,
          isCurrent: isLast,
        });
      });
    }

    return items;
  };

  const breadcrumbItems = buildBreadcrumbItems();

  // If we have too many items, show ellipsis for middle items
  const shouldShowEllipsis = breadcrumbItems.length > 4;
  const displayedItems: BreadcrumbDisplayItem[] = shouldShowEllipsis
    ? [
        breadcrumbItems[0], // "My Folders"
        breadcrumbItems[1], // First folder
        { type: "ellipsis" }, // Ellipsis placeholder
        breadcrumbItems[breadcrumbItems.length - 2], // Second to last
        breadcrumbItems[breadcrumbItems.length - 1], // Current folder
      ].filter((item): item is BreadcrumbDisplayItem => item !== undefined)
    : breadcrumbItems;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {displayedItems.map((item, index) => {
          if ("type" in item && item.type === "ellipsis") {
            return (
              <BreadcrumbItem key="ellipsis">
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
            );
          }

          // Type guard to ensure item has breadcrumb properties
          if (!("href" in item)) return null;

          const isLast = index === displayedItems.length - 1;

          return (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage className="font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
