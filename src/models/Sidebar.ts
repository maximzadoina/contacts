type tagType = 'include' | 'exclude';
export type messageCount = {
    min: string;
    max: string;
};

export interface SidebarProps {
    tagsToInclude: string[];
    tagsToExclude: string[];
    savedIncludedTags: string[];
    savedExcludedTags: string[];
    onTagSelect: (tag: string, tagPosition: number, type: tagType) => void;
    onTagRemove: (tagPosition: number, type: tagType) => void;
    onSave: () => void;
    onChange: (tags: string[], type: tagType) => void;
    totalContacts: number;
    onChangeMinSent: (min: string) => void;
    onChangeMaxSent: (max: string) => void;
    onChangeMinReceived: (min: string) => void;
    onChangeMaxReceived: (max: string) => void;
    msgSent: messageCount;
    msgReceived: messageCount;
}
