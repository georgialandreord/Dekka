import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

/**
 * Simple color test component to verify the new color system is working
 * Add this to any page to see the colors in action
 */
export function ColorTest() {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Color System Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Colors */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div
              className="border-border mb-2 h-16 w-full rounded border"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <p className="text-muted-foreground text-xs">Primary</p>
          </div>
          <div className="text-center">
            <div
              className="border-border mb-2 h-16 w-full rounded border"
              style={{ backgroundColor: "var(--file-document)" }}
            />
            <p className="text-muted-foreground text-xs">Document</p>
          </div>
          <div className="text-center">
            <div
              className="border-border mb-2 h-16 w-full rounded border"
              style={{ backgroundColor: "var(--file-image)" }}
            />
            <p className="text-muted-foreground text-xs">Image</p>
          </div>
          <div className="text-center">
            <div
              className="border-border mb-2 h-16 w-full rounded border"
              style={{ backgroundColor: "var(--file-video)" }}
            />
            <p className="text-muted-foreground text-xs">Video</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Action Buttons</p>
          <div className="flex flex-wrap gap-2">
            <Button
              style={{
                backgroundColor: "var(--action-upload)",
                color: "white",
              }}
            >
              Upload
            </Button>
            <Button
              style={{
                backgroundColor: "var(--action-download)",
                color: "white",
              }}
            >
              Download
            </Button>
            <Button
              style={{ backgroundColor: "var(--action-share)", color: "white" }}
            >
              Share
            </Button>
            <Button
              style={{ backgroundColor: "var(--destructive)", color: "white" }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Status Indicators</p>
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: "var(--success-light)",
                color: "var(--success-foreground)",
              }}
            >
              Success
            </span>
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: "var(--warning-light)",
                color: "var(--warning-foreground)",
              }}
            >
              Warning
            </span>
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: "var(--destructive-light)",
                color: "var(--destructive-foreground)",
              }}
            >
              Error
            </span>
          </div>
        </div>

        {/* File Type Examples */}
        <div className="space-y-2">
          <p className="text-sm font-medium">File Type Examples</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              { name: "Report.pdf", type: "document" },
              { name: "Photo.png", type: "image" },
              { name: "Video.mp4", type: "video" },
              { name: "Song.mp3", type: "audio" },
              { name: "Archive.zip", type: "archive" },
              { name: "Script.js", type: "code" },
            ].map((file) => (
              <div
                key={file.name}
                className="border-border flex items-center gap-2 rounded border p-2"
              >
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: `var(--file-${file.type})` }}
                />
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
