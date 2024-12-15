'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { OrderedSet } from 'immutable';
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  DraftHandleValue,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

const styleMap = {
  RED: {
    color: 'red',
  },
};

const RichTextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      );
    }
  }, []);

  // Save content to localStorage
  const handleSave = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem('editorContent', JSON.stringify(rawContent));
    alert('Content saved!');
  };

  // Helper function to update block type
  const updateBlockType = (
    editorState: EditorState,
    blockKey: string,
    blockType: string
  ): EditorState => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContentState = Modifier.setBlockType(
      contentState,
      selection.merge({
        anchorKey: blockKey,
        focusKey: blockKey,
        anchorOffset: 0,
        focusOffset: contentState.getBlockForKey(blockKey).getText().length,
      }),
      blockType
    );

    return EditorState.push(editorState, newContentState, 'change-block-type');
  };

  const handleBeforeInput = (input: string, editorState: EditorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const blockText = currentContent.getBlockForKey(blockKey).getText();

    if (input === ' ' && blockText === '#') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        '' // Remove the '#'
      );
      const updatedEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      const headingEditorState = updateBlockType(
        updatedEditorState,
        blockKey,
        'header-one'
      );
      setEditorState(headingEditorState);
      return 'handled';
    } else if (input === ' ' && blockText === '*') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        ''
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      const boldEditorState = RichUtils.toggleInlineStyle(
        EditorState.setInlineStyleOverride(newEditorState, OrderedSet()),
        'BOLD'
      );
      setEditorState(boldEditorState);
      return 'handled';
    } else if (blockText === '**' && input === ' ') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 2 }),
        ''
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      const redEditorState = RichUtils.toggleInlineStyle(
        EditorState.setInlineStyleOverride(newEditorState, OrderedSet()),
        'RED'
      );
      setEditorState(redEditorState);
      return 'handled';
    } else if (blockText === '***' && input === ' ') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 3 }),
        ''
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      const underlineEditorState = RichUtils.toggleInlineStyle(
        EditorState.setInlineStyleOverride(newEditorState, OrderedSet()),
        'UNDERLINE'
      );
      setEditorState(underlineEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleReturn = (e: any, editorState: EditorState): DraftHandleValue => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // Split block and ensure the new block is unstyled
    const newContentState = Modifier.splitBlock(contentState, selection);
    const editorStateWithNewBlock = EditorState.push(
      editorState,
      newContentState,
      'split-block'
    );

    // Reset block type for the new block
    const newSelection = editorStateWithNewBlock.getSelection();
    const newBlockKey = newSelection.getStartKey();
    const updatedEditorState = updateBlockType(
      editorStateWithNewBlock,
      newBlockKey,
      'unstyled'
    );

    // Clear inline styles for the new block
    const withoutStylesEditorState = EditorState.setInlineStyleOverride(
      updatedEditorState,
      OrderedSet()
    );

    setEditorState(withoutStylesEditorState);
    return 'handled';
  };

  // Handle key commands (e.g., Ctrl + B)
  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    },
    []
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Demo Editor by Atul Jaiswar</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          marginBottom: '10px',
        }}
        onClick={() =>
          (document.querySelector('.DraftEditor-root') as HTMLElement)?.focus()
        }
      >
        {editorState ? (
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleBeforeInput={handleBeforeInput}
            handleKeyCommand={handleKeyCommand}
            customStyleMap={styleMap}
            handleReturn={handleReturn}
            placeholder='Type here... Use * for bold'
          />
        ) : null}
      </div>
      <button
        onClick={handleSave}
        style={{
          padding: '5px 20px',
          fontSize: '16px',
          boxShadow: '0 0 2px 0px #000',
          backgroundColor: 'transparent',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
    </div>
  );
};

export default RichTextEditor;
