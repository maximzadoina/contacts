export interface TagTableProps {
    title: string;
    selectedTags: string[];
    savedTags: string[];
    onTagSelect: (tag: string, tagPosition: number) => void;
    onTagRemove: (tagPosition: number) => void;
    onChange: (tags: string[]) => void;
}
