import { Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { ArrowUpFromLine, FolderPlus } from "lucide-react";
import { useState } from "react";
import BreadcrumbNavigation from "~/components/breadcrumb-navigation";
import CreateFolderDialog from "~/components/modal/create-folder-dialog";
import UploadFileDialog from "~/components/modal/upload-file-dialog";

export function FolderLayout() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  return (
    <>
      <main className="flex flex-1 flex-col">
        <div className="flex-1 px-4">
          <div className="sticky top-0 z-50 bg-[#f0f2f5]">
            {/* Breadcrumb navigation */}
            <BreadcrumbNavigation />

            {/* Header section */}
            <div className="bg-[#f0f2f5] mb-8 flex py-3 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-primary mb-2 text-4xl font-bold">
                  My Folders
                </h1>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowUploadDialog(true)}
                  variant="outline"
                  className="border-border hover:border-primary cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
                  size="lg"
                >
                  <ArrowUpFromLine className="mr-2 h-5 w-5" />
                  Upload Files
                </Button>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
                  size="lg"
                >
                  <FolderPlus className="mr-2 h-5 w-5" />
                  New Folder
                </Button>
              </div>
            </div>
          </div>

          <Outlet />
        </div>

        <CreateFolderDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
        <UploadFileDialog
          open={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
        />
      </main>
    </>
  );
}
