import type { files } from "dropbox";
import { Search, Folder, FileText, Clock, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router";
import { api } from "~/trpc/react";
import { useDebounceValue } from "usehooks-ts";

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
}

const SearchDropdown = ({
  placeholder = "Search folders...",
  className = "",
}: SearchDropdownProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedQuery] = useDebounceValue(query, 400);

  const { data, isPending } = api.folder.searchFolders.useQuery(
    { query: debouncedQuery },
    {
      enabled: debouncedQuery.trim().length > 0,
    },
  );

  // Filter results based on query
  const filteredResults = debouncedQuery.trim()
    ? data?.filter(
        (item) =>
          item?.name.toLowerCase().includes(debouncedQuery?.toLowerCase()) ||
          item?.path_lower
            ?.toLowerCase()
            .includes(debouncedQuery?.toLowerCase()),
      )
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: files.FolderMetadata) => {
    console.log("Selected:", result);
    setQuery(result.name);
    setIsOpen(false);
    // Add your navigation logic here
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${className} w-[220px] md:w-[300px]`}
    >
      {/* Search Input */}
      <div
        className={`bg-background border-border focus-within:border-primary/50 focus-within:ring-primary/10 focus-within:bg-background flex items-center rounded-lg border px-3 py-2.5 transition-all duration-200 ease-out focus-within:ring-2`}
      >
        <Search className="text-muted-foreground mr-2.5 h-4 w-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="text-foreground placeholder-muted-foreground w-64 bg-transparent text-sm outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="hover:bg-muted ml-2 cursor-pointer rounded p-0.5 transition-colors"
          >
            <X className="text-muted-foreground h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="bg-popover border-border animate-fade-in absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border shadow-lg">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6">
              <Clock className="text-muted-foreground h-4 w-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Searching folders...
              </span>
            </div>
          ) : filteredResults && filteredResults?.length > 0 ? (
            <>
              <div className="border-border border-b px-3 py-2">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {filteredResults?.length} result
                  {filteredResults?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <ul className="max-h-80 overflow-y-auto py-1">
                {filteredResults &&
                  filteredResults?.map((result, index) => {
                    if (!result) return null;
                    const type = result[".tag"];

                    return (
                      <NavLink
                        to={`/dashboard/folders${result.path}`}
                        key={result.id}
                        className="cursor-pointer"
                      >
                        <button
                          onClick={() => handleResultClick(result)}
                          className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              type === "folder"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            } `}
                          >
                            {type === "folder" ? (
                              <Folder className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm font-medium">
                              {result.name}
                            </p>
                          </div>
                        </button>
                      </NavLink>
                    );
                  })}
              </ul>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <Search className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No results found for "{query}"
              </p>
              <p className="text-muted-foreground/70 mt-1 text-xs">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
