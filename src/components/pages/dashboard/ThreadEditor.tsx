import styled from '@emotion/styled';
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Chip, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Save, Close, FormatBold, FormatItalic, FormatQuote, Image, Link as LinkIcon } from '@mui/icons-material';

const EditorContainer = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
`;

const EditorTitle = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  color: #f9d423;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  
  .MuiOutlinedInput-root {
    color: white;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.23);
    }
    
    &:hover fieldset {
      border-color: rgba(249, 212, 35, 0.5);
    }
    
    &.Mui-focused fieldset {
      border-color: #f9d423;
    }
  }
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #f9d423;
    }
  }
`;

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }

  &.secondary {
    background: transparent;
    color: #f9d423;
    border: 1px solid #f9d423;
    
    &:hover {
      background-color: rgba(249, 212, 35, 0.1);
    }
  }
`;

const FormatToolbar = styled(Box)`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
`;

const StyledIconButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  
  &:hover, &.active {
    color: #f9d423;
    background-color: rgba(249, 212, 35, 0.1);
  }
`;

const StyledChip = styled(Chip)`
  background: rgba(249, 212, 35, 0.1);
  color: #f9d423;
  border: 1px solid rgba(249, 212, 35, 0.3);
  margin: 0.25rem;
  
  &:hover {
    background: rgba(249, 212, 35, 0.2);
  }

  .MuiChip-deleteIcon {
    color: rgba(249, 212, 35, 0.7);
    
    &:hover {
      color: #f9d423;
    }
  }
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 1rem;
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #f9d423;
    }
  }
  
  .MuiOutlinedInput-root {
    color: white;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.23);
    }
    
    &:hover fieldset {
      border-color: rgba(249, 212, 35, 0.5);
    }
    
    &.Mui-focused fieldset {
      border-color: #f9d423;
    }
  }

  .MuiSelect-icon {
    color: rgba(255, 255, 255, 0.7);
  }
`;

interface ThreadEditorProps {
  onSave: (threadData: ThreadData) => void;
  onCancel: () => void;
  initialData?: ThreadData;
}

interface ThreadData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [threadData, setThreadData] = useState<ThreadData>(initialData || {
    title: '',
    content: '',
    category: '',
    tags: [],
    isPinned: false
  });

  const [newTag, setNewTag] = useState('');
  const [formatOptions, setFormatOptions] = useState({
    bold: false,
    italic: false,
    quote: false
  });

  const handleFormatClick = (format: keyof typeof formatOptions) => {
    setFormatOptions(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newTag.trim() !== '') {
      if (!threadData.tags.includes(newTag.trim())) {
        setThreadData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setThreadData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    onSave(threadData);
  };

  return (
    <EditorContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <EditorTitle>
          {initialData ? 'Edit Thread' : 'New Thread'}
        </EditorTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ActionButton
            className="secondary"
            onClick={onCancel}
            startIcon={<Close />}
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleSave}
            startIcon={<Save />}
          >
            Save
          </ActionButton>
        </Box>
      </Box>

      <StyledFormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={threadData.category}
          label="Category"
          onChange={(e) => setThreadData(prev => ({ ...prev, category: e.target.value as string }))}
        >
          <MenuItem value="announcements">Announcements</MenuItem>
          <MenuItem value="roleplay">Roleplay Scenarios</MenuItem>
          <MenuItem value="help">Help & Support</MenuItem>
        </Select>
      </StyledFormControl>

      <StyledTextField
        fullWidth
        label="Thread Title"
        value={threadData.title}
        onChange={(e) => setThreadData(prev => ({ ...prev, title: e.target.value }))}
      />

      <FormatToolbar>
        <StyledIconButton
          className={formatOptions.bold ? 'active' : ''}
          onClick={() => handleFormatClick('bold')}
        >
          <FormatBold />
        </StyledIconButton>
        <StyledIconButton
          className={formatOptions.italic ? 'active' : ''}
          onClick={() => handleFormatClick('italic')}
        >
          <FormatItalic />
        </StyledIconButton>
        <StyledIconButton
          className={formatOptions.quote ? 'active' : ''}
          onClick={() => handleFormatClick('quote')}
        >
          <FormatQuote />
        </StyledIconButton>
        <StyledIconButton>
          <Image />
        </StyledIconButton>
        <StyledIconButton>
          <LinkIcon />
        </StyledIconButton>
      </FormatToolbar>

      <StyledTextField
        fullWidth
        multiline
        rows={10}
        label="Content"
        value={threadData.content}
        onChange={(e) => setThreadData(prev => ({ ...prev, content: e.target.value }))}
      />

      <Box sx={{ mb: 2 }}>
        <StyledTextField
          fullWidth
          label="Add Tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleAddTag}
          placeholder="Press Enter to add tags"
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {threadData.tags.map(tag => (
            <StyledChip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
            />
          ))}
        </Box>
      </Box>
    </EditorContainer>
  );
};

export default ThreadEditor;