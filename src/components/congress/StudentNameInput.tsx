import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  value: string;
  onChange: (name: string, userId?: string) => void;
  placeholder?: string;
  className?: string;
}

interface StudentSuggestion {
  id: string;
  full_name: string;
  email: string;
}

export default function StudentNameInput({ value, onChange, placeholder, className }: Props) {
  const [suggestions, setSuggestions] = useState<StudentSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchStudents = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    setLoading(true);
    setSearchError(null);
    const { data, error } = await supabase.rpc("search_students", {
      _query: query,
      _limit: 5,
    });

    if (error) {
      setSuggestions([]);
      setSearchError("Student lookup is unavailable right now.");
      setLoading(false);
      return;
    }

    setSuggestions((data || []).map((student) => ({
      id: student.id,
      full_name: student.full_name || "",
      email: student.email || "",
    })));
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Any manual edits should remove a previously selected linked account.
    onChange(val, undefined);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchStudents(val), 300);
  };

  const handleSelect = (s: StudentSuggestion) => {
    onChange(s.full_name || "", s.id);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder || "Student name"}
        className={className}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent/10 flex justify-between items-center"
              onClick={() => handleSelect(s)}
            >
              <span className="font-medium text-foreground">{s.full_name}</span>
              <span className="text-xs text-muted-foreground">{s.email}</span>
            </button>
          ))}
        </div>
      )}
      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg p-2">
          <p className="text-xs text-muted-foreground text-center">
            {searchError || "No registered students found — name will be added as guest"}
          </p>
        </div>
      )}
    </div>
  );
}
