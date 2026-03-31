import { Camera, Loader2, Mail, User, Save, ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";
import { convertHeicToPng } from "~/lib/heic-converter";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  bannerUrl: string;
}

const UserProfile = () => {
  const { data: session } = authClient.useSession();
  const uploadImageMutation = api.cloudnary.getPresignedUrl.useMutation();
  const uploadBannerMutation =
    api.cloudnary.getBannerPresignedUrl.useMutation();
  const [userData, setUserData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    bannerUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initialize userData from session.user when session is loaded
  useEffect(() => {
    if (!session?.user) return;

    const fullName = session.user.name ?? "";
    const [firstName = "", ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");

    setUserData({
      firstName,
      lastName,
      email: session.user.email ?? "",
      avatarUrl: session.user.image ?? "",
      bannerUrl: session.user.banner ?? "",
    });
  }, [session]);

  const handleSave = async () => {
    try {
      let imageUrl = userData.avatarUrl;
      let bannerUrl = userData.bannerUrl;

      setIsPending(true);

      // Upload image if a file is selected
      if (selectedFile) {
        const { params, signature, uploadUrl } =
          await uploadImageMutation.mutateAsync({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          });

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", params.api_key);
        formData.append("folder", params.folder);
        formData.append("timestamp", params.timestamp.toString());
        formData.append("public_id", params.public_id);
        formData.append("signature", signature);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        imageUrl = result.secure_url;
      }

      if (selectedBannerFile) {
        const { params, signature, uploadUrl } =
          await uploadBannerMutation.mutateAsync({
            fileName: selectedBannerFile.name,
            fileType: selectedBannerFile.type,
          });

        const formData = new FormData();
        formData.append("file", selectedBannerFile);
        formData.append("api_key", params.api_key);
        formData.append("folder", params.folder);
        formData.append("timestamp", params.timestamp.toString());
        formData.append("public_id", params.public_id);
        formData.append("signature", signature);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        bannerUrl = result.secure_url;
      }

      // Update user profile with new image URL
      await authClient.updateUser({
        name: `${userData.firstName} ${userData.lastName}`,
        image: imageUrl,
        banner: bannerUrl,
      });

      setIsPending(false);

      setUserData((prev) => ({ ...prev, avatarUrl: imageUrl }));
      setIsEditing(false);
      toast.success("Profile update successfully");
      setSelectedFile(null); // Clear selected file after save
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convert HEIC if needed
      let processedFile = file;
      if (
        file.type === "image/heic" ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        processedFile = await convertHeicToPng(file);
      }

      if (processedFile.type.startsWith("image/")) {
        setSelectedFile(processedFile);

        // Preview image locally
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUserData((prev) => ({ ...prev, avatarUrl: result }));
        };
        reader.readAsDataURL(processedFile);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      toast.error("Failed to process image file");
    }
  };

  const handleBannerChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convert HEIC if needed
      let processedFile = file;
      if (
        file.type === "image/heic" ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        processedFile = await convertHeicToPng(file);
      }

      if (processedFile.type.startsWith("image/")) {
        setSelectedBannerFile(processedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUserData((prev) => ({ ...prev, bannerUrl: result }));
        };
        reader.readAsDataURL(processedFile);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      toast.error("Failed to process image file");
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-in mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-accent-foreground text-2xl font-semibold tracking-tight">
            Profile Settings
          </h1>
        </div>

        {/* Main Card */}
        <div className="card-shadow border-border bg-card hover:shadow-card-hover overflow-hidden rounded-xl border transition-shadow duration-300">
          {/* Banner Section */}
          <div className="group relative z-0 h-40">
            <input
              type="file"
              ref={bannerInputRef}
              onChange={handleBannerChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleBannerClick}
              className="focus:ring-primary relative h-full w-full cursor-pointer overflow-hidden focus:ring-2 focus:outline-none focus:ring-inset"
            >
              {userData.bannerUrl ? (
                <img
                  src={userData.bannerUrl}
                  alt="Profile banner"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="profile-gradient h-full w-full" />
              )}
              <div className="absolute inset-0 bg-transparent" />
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex items-center gap-2 rounded-lg bg-black/70 px-4 py-2 text-white">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Change Banner</span>
                </div>
              </div>
            </button>
          </div>

          {/* Avatar Section */}
          <div className="relative px-6 pb-4">
            <div className="flex items-end gap-5">
              {/* FIX: Added z-20 here to ensure it sits above the banner (which has z-10 elements) */}
              <div className="group relative z-20 -mt-16">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={handleAvatarClick}
                  className="avatar-ring bg-card ring-card focus:ring-primary relative h-28 w-28 cursor-pointer overflow-hidden rounded-full ring-4 transition-transform duration-200 hover:scale-105 focus:outline-none"
                >
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={`${userData.firstName} ${userData.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-secondary flex h-full w-full items-center justify-center">
                      <User className="text-muted-foreground h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </button>
              </div>

              <div className="relative z-20 mb-2">
                <h2 className="text-foreground text-xl font-semibold">
                  {`${userData.firstName} ${userData.lastName}` || "Your Name"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-border mx-6 border-t" />

          {/* Form Section */}
          <div className="p-6">
            <h3 className="text-muted-foreground mb-6 text-sm font-medium tracking-wider uppercase">
              Personal Information
            </h3>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    First name
                  </label>
                  <Input
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                    className="border-border bg-background focus:border-primary h-11 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Last name
                  </label>
                  <Input
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData({ ...userData, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                    className="border-border bg-background focus:border-primary h-11 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={userData.email}
                    disabled={true}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="border-border bg-background focus:border-primary h-11 cursor-not-allowed pl-10 opacity-60 transition-colors"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-border bg-secondary/30 flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              onClick={handleSave}
              disabled={isPending}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary shadow-button hover:shadow-button-hover cursor-pointer transition-all duration-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
