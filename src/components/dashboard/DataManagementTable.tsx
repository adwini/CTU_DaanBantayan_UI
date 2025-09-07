"use client";

import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TimePicker, DateTimePicker } from "@/components/ui/datetime-picker";
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconX,
  IconRefresh,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Generic interfaces
export interface BaseItem {
  id: number;
  status?: string;
  [key: string]: unknown;
}

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: unknown, item: BaseItem) => React.ReactNode;
  searchable?: boolean;
}

export interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "select" | "number" | "time" | "datetime";
  required?: boolean;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  dependsOn?: string;
  dependsOnValue?: string | string[];
  gridColumn?: 1 | 2; // 1 for full width, 2 for half width
}

export interface FilterOption {
  key: string;
  label: string;
  options: string[] | { value: string; label: string }[];
}

export interface DataManagementTableProps {
  title: string;
  description: string;
  data: BaseItem[];
  columns: TableColumn[];
  formFields: FormField[];
  filterOptions?: FilterOption[];
  onAdd?: (item: Omit<BaseItem, "id">) => void;
  onEdit?: (id: number, item: Partial<BaseItem>) => void;
  onDelete?: (id: number) => void;
  onStatusToggle?: (id: number) => void;
  onRefresh?: () => void | Promise<void>;
  searchPlaceholder?: string;
  addButtonText?: string;
  editModalTitle?: string;
  addModalTitle?: string;
  editModalDescription?: string;
  addModalDescription?: string;
  getBadgeColor?: (key: string, value: unknown) => string;
  actions?: {
    edit?: boolean;
    statusToggle?: boolean;
    delete?: boolean;
  };
}

export function DataManagementTable({
  title,
  description,
  data,
  columns,
  formFields,
  filterOptions = [],
  onAdd,
  onEdit,
  onDelete,
  onStatusToggle,
  onRefresh,
  searchPlaceholder = "Search...",
  addButtonText = "Add Item",
  editModalTitle = "Edit Item",
  addModalTitle = "Add New Item",
  editModalDescription = "Update the item details below.",
  addModalDescription = "Fill in the details to create a new item.",
  getBadgeColor,
  actions = { edit: true, statusToggle: true, delete: true },
}: DataManagementTableProps) {
  const [items, setItems] = useState<BaseItem[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Prevent auto-selection when modal opens in edit mode
  useEffect(() => {
    if (isModalOpen && isEditMode && firstInputRef.current) {
      const timeoutId = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.blur();
          firstInputRef.current.setSelectionRange(0, 0);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen, isEditMode]);

  // Update items when data prop changes
  useEffect(() => {
    setItems(data);
  }, [data]);

  // Filter items based on search term and filters
  const filteredItems = items.filter((item) => {
    // Search filter
    const searchableColumns = columns.filter((col) => col.searchable !== false);
    const matchesSearch =
      searchTerm === "" ||
      searchableColumns.some((col) => {
        const value = item[col.key];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

    // Additional filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (value === "All" || value === "") return true;
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    const initialFormData: Record<string, unknown> = {};
    formFields.forEach((field) => {
      initialFormData[field.key] = "";
    });
    setFormData(initialFormData);
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && editingItem !== null) {
      // Update existing item
      const updatedItems = items.map((item) =>
        item.id === editingItem ? { ...item, ...formData } : item
      );
      setItems(updatedItems);
      onEdit?.(editingItem, formData);
    } else {
      // Add new item
      const newItem: BaseItem = {
        ...formData,
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        status: (formData.status as string) || "active",
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      onAdd?.(newItem);
    }

    resetForm();
  };

  const handleAddItem = () => {
    const initialFormData: Record<string, unknown> = {};
    formFields.forEach((field) => {
      initialFormData[field.key] = "";
    });
    setFormData(initialFormData);
    setIsEditMode(false);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (itemId: number) => {
    const itemToEdit = items.find((item) => item.id === itemId);
    if (itemToEdit) {
      const editFormData: Record<string, unknown> = {};
      formFields.forEach((field) => {
        editFormData[field.key] = itemToEdit[field.key] || "";
      });
      setFormData(editFormData);
      setIsEditMode(true);
      setEditingItem(itemId);
      setIsModalOpen(true);
    }
  };

  const handleStatusToggle = (itemId: number) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? { ...item, status: item.status === "active" ? "inactive" : "active" }
        : item
    );
    setItems(updatedItems);
    onStatusToggle?.(itemId);
  };

  const handleDeleteItem = (itemId: number) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    onDelete?.(itemId);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    } else {
      setIsModalOpen(open);
    }
  };

  const getFilterValue = (key: string) => {
    return filters[key] || "All";
  };

  const setFilterValue = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "All"
  );

  const renderFormField = (field: FormField, index: number) => {
    // Check if field should be shown based on dependencies
    if (field.dependsOn && field.dependsOnValue) {
      const dependentValue = formData[field.dependsOn];
      const expectedValues = Array.isArray(field.dependsOnValue)
        ? field.dependsOnValue
        : [field.dependsOnValue];

      if (!expectedValues.includes(String(dependentValue))) {
        return null;
      }
    }

    const isFirstField = index === 0;
    const fieldValue = String(formData[field.key] || "");
    const commonProps = {
      id: field.key,
      value: fieldValue,
      required: field.required,
      ...(isFirstField && { ref: firstInputRef }),
    };

    switch (field.type) {
      case "select":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label} {field.required && "*"}
            </Label>
            <Select
              value={fieldValue}
              onValueChange={(value) => handleInputChange(field.key, value)}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    field.placeholder || `Select ${field.label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => {
                  const value =
                    typeof option === "string" ? option : option.value;
                  const label =
                    typeof option === "string" ? option : option.label;
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );

      case "email":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              {...commonProps}
              type="email"
              placeholder={field.placeholder}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              autoFocus={false}
            />
          </div>
        );

      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={field.placeholder}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              autoFocus={false}
            />
          </div>
        );

      case "time":
        return (
          <div key={field.key} className="space-y-2">
            <TimePicker
              label={field.label}
              value={fieldValue}
              onChange={(value) => handleInputChange(field.key, value)}
              required={field.required}
              placeholder={field.placeholder}
              id={field.key}
            />
          </div>
        );

      case "datetime":
        return (
          <div key={field.key} className="space-y-2">
            <DateTimePicker
              label={field.label}
              value={
                fieldValue
                  ? (() => {
                      // Parse the datetime value if it exists
                      if (
                        typeof fieldValue === "string" &&
                        fieldValue.includes("T")
                      ) {
                        const [date, time] = fieldValue.split("T");
                        return { date, time: time.slice(0, 5) }; // Remove seconds
                      }
                      return { date: "", time: "" };
                    })()
                  : { date: "", time: "" }
              }
              onChange={(value) => {
                // Combine date and time into ISO string format
                if (value.date && value.time) {
                  const datetime = `${value.date}T${value.time}:00`;
                  handleInputChange(field.key, datetime);
                } else {
                  handleInputChange(field.key, "");
                }
              }}
              required={field.required}
              placeholder={field.placeholder}
              id={field.key}
            />
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              {...commonProps}
              placeholder={field.placeholder}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              autoFocus={false}
            />
          </div>
        );
    }
  };

  const getDefaultBadgeColor = (value: unknown) => {
    if (typeof value === "string") {
      switch (value.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-red-100 text-red-800";
        case "admin":
          return "bg-red-100 text-red-800";
        case "teacher":
          return "bg-blue-100 text-blue-800";
        case "student":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="h-6" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
          <div className="p-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="p-6 pt-0">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-sm p-1"
                    aria-label="Clear search">
                    <IconX className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Dynamic Filters */}
              {filterOptions.map((filter) => (
                <Select
                  key={filter.key}
                  value={getFilterValue(filter.key)}
                  onValueChange={(value) => setFilterValue(filter.key, value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All {filter.label}</SelectItem>
                    {filter.options.map((option) => {
                      const value =
                        typeof option === "string" ? option : option.value;
                      const label =
                        typeof option === "string" ? option : option.label;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ))}

              {/* Clear All Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm">
                  Clear All Filters
                </Button>
              )}

              {/* Refresh Button */}
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-sm">
                  <IconRefresh
                    className={`h-4 w-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              )}

              {/* Add Item Button */}
              <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleAddItem}
                    className="btn-ctu-primary shadow-sm">
                    <IconPlus className="h-4 w-4 mr-2" />
                    {addButtonText}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? editModalTitle : addModalTitle}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode ? editModalDescription : addModalDescription}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dynamic Form Fields */}
                    {formFields.reduce<React.ReactNode[]>(
                      (acc, field, index) => {
                        const fieldComponent = renderFormField(field, index);
                        if (!fieldComponent) return acc;

                        // Group fields based on gridColumn
                        if (field.gridColumn === 2) {
                          // Find the next field that also has gridColumn === 2
                          const nextFieldIndex = index + 1;
                          const nextField = formFields[nextFieldIndex];
                          if (nextField && nextField.gridColumn === 2) {
                            const nextFieldComponent = renderFormField(
                              nextField,
                              nextFieldIndex
                            );
                            // Skip processing the next field
                            formFields.splice(nextFieldIndex, 1);
                            acc.push(
                              <div
                                key={`grid-${index}`}
                                className="grid grid-cols-2 gap-4">
                                {fieldComponent}
                                {nextFieldComponent}
                              </div>
                            );
                            return acc;
                          }
                        }

                        acc.push(fieldComponent);
                        return acc;
                      },
                      []
                    )}

                    <div className="flex justify-end space-x-2 pt-6 border-t border-border/50">
                      <Button
                        type="button"
                        variant="outline"
                        className="btn-ctu-secondary"
                        onClick={() => resetForm()}>
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-ctu-primary">
                        {isEditMode ? "Update Item" : "Add Item"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Items Table */}
            <div className="rounded-lg border shadow-sm card-enhanced">
              <Table>
                <TableHeader>
                  <TableRow className="table-header-enhanced hover:from-primary/8 hover:to-primary/15 transition-all duration-200">
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className="font-semibold text-foreground">
                        {column.label}
                      </TableHead>
                    ))}
                    {(actions.edit ||
                      actions.statusToggle ||
                      actions.delete) && (
                      <TableHead className="font-semibold text-foreground">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="text-center py-12 text-muted-foreground animate-fade-in">
                        <div className="flex flex-col items-center gap-2">
                          <IconSearch className="h-8 w-8 text-muted-foreground/40" />
                          <span>No items found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-accent/50 transition-colors duration-150 animate-fade-in">
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={
                              column.key === columns[0]?.key
                                ? "font-medium"
                                : ""
                            }>
                            {column.render ? (
                              column.render(item[column.key], item)
                            ) : column.key === "status" ||
                              column.key.includes("role") ? (
                              <Badge
                                className={
                                  getBadgeColor
                                    ? getBadgeColor(
                                        column.key,
                                        item[column.key]
                                      )
                                    : getDefaultBadgeColor(item[column.key])
                                }>
                                {typeof item[column.key] === "string"
                                  ? (item[column.key] as string)
                                      .charAt(0)
                                      .toUpperCase() +
                                    (item[column.key] as string).slice(1)
                                  : String(item[column.key])}
                              </Badge>
                            ) : (
                              String(item[column.key] || "")
                            )}
                          </TableCell>
                        ))}
                        {(actions.edit ||
                          actions.statusToggle ||
                          actions.delete) && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0">
                                  <IconDots className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                {actions.edit && (
                                  <DropdownMenuItem
                                    onClick={() => handleEditItem(item.id)}>
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {actions.statusToggle && item.status && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusToggle(item.id)}>
                                    {item.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                  </DropdownMenuItem>
                                )}
                                {(actions.edit || actions.statusToggle) &&
                                  actions.delete && <DropdownMenuSeparator />}
                                {actions.delete && (
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => handleDeleteItem(item.id)}>
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>
                Showing {filteredItems.length} of {items.length} items
              </span>
              <span>
                {Object.entries(filters).some(
                  ([, value]) => value !== "All" && value !== ""
                ) &&
                  `Filtered by: ${Object.entries(filters)
                    .filter(([, value]) => value !== "All" && value !== "")
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
