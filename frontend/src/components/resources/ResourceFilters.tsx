import type { ChangeEvent } from "react";

interface ResourceFiltersProps {
  search: string;
  branch: string;
  semester: string;
  category: string;

  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;

  branchOptions?: string[];
}

const defaultBranches = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "ME",
  "CE",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const categories = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
];

export default function ResourceFilters({
  search,
  branch,
  semester,
  category,
  onSearchChange,
  onBranchChange,
  onSemesterChange,
  onCategoryChange,
  onClear,
  branchOptions = defaultBranches,
}: ResourceFiltersProps) {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const hasFilters =
    search.trim() !== "" ||
    branch !== "" ||
    semester !== "" ||
    category !== "";

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Find Resources
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Search and filter resources by branch, semester and category.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <label
            htmlFor="resource-search"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Search
          </label>

          <input
            id="resource-search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search resources..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Branch */}
        <div>
          <label
            htmlFor="resource-branch"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Branch
          </label>

          <select
            id="resource-branch"
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Branches</option>

            {branchOptions.map((branchName) => (
              <option key={branchName} value={branchName}>
                {branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label
            htmlFor="resource-semester"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Semester
          </label>

          <select
            id="resource-semester"
            value={semester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Semesters</option>

            {semesters.map((semesterNumber) => (
              <option key={semesterNumber} value={semesterNumber}>
                Semester {semesterNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="resource-category"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Category
          </label>

          <select
            id="resource-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Categories</option>

            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}