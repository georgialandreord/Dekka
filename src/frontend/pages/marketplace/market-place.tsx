import type { UserStickerPacks } from "generated/prisma";
import { Package, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import DeletePackConfirmModal from "~/components/marketPlace/delete-pack-confirm-modal";
import PackCard from "~/components/marketPlace/Pack-card";
import PackFormModal from "~/components/marketPlace/pack-form-modal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ALL_TAGS } from "~/mockdata";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";
import type { StickerPack, StickerPackFormData } from "~/types";

const MarketPlace = () => {
  const utils = api.useUtils();
  const { data: session } = authClient.useSession();

  // const [packs, setPacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<UserStickerPacks | null>(null);
  const [deletingPack, setDeletingPack] = useState<UserStickerPacks | null>(null);

  const { data: packsData = [], isLoading } =
    api.userStickerPacks.getPacks.useQuery({
      searchQuery,
      tag: selectedTag,
    });
  const createMutation = api.userStickerPacks.createPack.useMutation({
    onSuccess: (data) => {
      toast.success(data?.message);
      setIsFormModalOpen(false);
      // Invalidate query to refetch list
      utils.userStickerPacks.getPacks.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to create: ${err.message}`);
    },
  });

  const editMutation = api.userStickerPacks.editPack.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setIsFormModalOpen(false);
      setEditingPack(null);
      utils.userStickerPacks.getPacks.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to update: ${err.message}`);
    },
  });

  const deleteMutation = api.userStickerPacks.deletePack.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setDeletingPack(null);
      utils.userStickerPacks.getPacks.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });

  const filteredPacks = useMemo(() => {
    return packsData?.filter((pack) => {
      const matchesSearch =
        pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pack.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === "all" || pack.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [packsData, searchQuery, selectedTag]);

  const handleCreatePack = (data: StickerPackFormData) => {
    createMutation.mutate(data);
    // setPacks((prev) => [newPack, ...prev]);
  };

  const handleEditPack = (data: StickerPackFormData) => {
    if (!editingPack) return;
    editMutation.mutate({
      id: editingPack.id,
      data: data,
    });
  };

  const handleDeletePack = () => {
    if (!deletingPack) return;
    deleteMutation.mutate({ id: deletingPack.id });
  };

  const openEditModal = (pack: UserStickerPacks) => {
    setEditingPack(pack);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (pack: UserStickerPacks) => {
    setDeletingPack(pack);
  };

  const getIsFavorited = (pack: UserStickerPacks) => {
    return !!session && pack.favoriteUserIds.includes(session.user.id);
  };

  return (
    <>
      <div className="bg-background">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="bg-primary mb-2 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Sticker Marketplace
            </h1>
          </div>
          <Button
            onClick={() => {
              setEditingPack(null);
              setIsFormModalOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Pack
          </Button>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Search and Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Search sticker packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-card focus-visible:ring-primary h-10 rounded-md pl-12 shadow-sm focus-visible:ring-2"
              />
            </div>

            {/* Tag Filters */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {ALL_TAGS.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  onClick={() => setSelectedTag(tag)}
                  className={`h-10 cursor-pointer rounded-full px-4 whitespace-nowrap transition-all ${selectedTag === tag
                      ? "gradient-primary text-primary-foreground border-0 shadow-md"
                      : "hover:border-primary hover:text-primary"
                    }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Button>
              ))}
            </div>
            
          </div>

          {/* Packs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted aspect-4/5 animate-pulse rounded-2xl"
                  />
                ))}
            </div>
          ) : filteredPacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPacks.map((pack, index) => (
                <div
                  key={pack.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PackCard
                    pack={pack}
                    index={index}
                    isOwner={pack.createdById === session?.user?.id}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted mb-4 rounded-full p-6">
                <Package className="text-muted-foreground h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No packs found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || selectedTag !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Be the first to add a sticker pack to the marketplace!"}
              </p>
              {(searchQuery || selectedTag !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <PackFormModal
          open={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          pack={editingPack}
          isPending={
            editingPack ? editMutation.isPending : createMutation.isPending
          }
          onSubmit={editingPack ? handleEditPack : handleCreatePack}
        />

        <DeletePackConfirmModal
          open={!!deletingPack}
          onOpenChange={(open) => !open && setDeletingPack(null)}
          pack={deletingPack}
          onConfirm={handleDeletePack}
          isPending={deleteMutation.isPending}
        />
      </div>
    </>
  );
};

export default MarketPlace;
