import { ChatInputType, ProjectSpecs, fixProjectIssue, getProjectSpecs } from '@/apis';
import React, { useEffect, useRef, useState } from 'react';
import ContentEditor from '@/components/general/ContentEditor';
import { MdRestore } from 'react-icons/md';
import ImageChatInput from '@/components/general/ChatFields/ImageChat';
import { validateYAML } from '@/utils';
import * as yaml from 'js-yaml';

interface ProjectSpecsProps {
  projectId: number;
  onFinish: () => void;
  setAdditionalButtons: (buttons: React.ReactNode) => void;
}

export const ReviewProjectSpecs: React.FC<ProjectSpecsProps> = ({ projectId, onFinish, setAdditionalButtons }) => {
  const [_content, setContent] = useState<string>("");
  const [original, setOriginal] = useState<string | undefined>();
  const initialContent = useRef<string | null>(null);

  const onSubmit = async (issues: ChatInputType) => {
    const valid = validateYAML(_content);
    if (!valid) {
      alert("Project specs must be valid YAML. Please fix the errors before submitting.");
      return;
    }

    if (issues?.text) {
      const content = initialContent.current == _content ? undefined : _content;
      const resps = await fixProjectIssue(projectId, issues, content)
      console.log(resps)
      _content && setOriginal(_content)
      resps?.projectSpecs && setContent(resps.projectSpecs);
    } else {
      await fixProjectIssue(projectId, null, _content)
      onFinish();
    }
  };

  useEffect(() => {
    getProjectSpecs(projectId).then((specsText) => {
      console.log('project specs', specsText)
      initialContent.current = specsText;
      setContent(prev => prev !== specsText ? specsText : prev);
    })
    // const specs = yaml.dump(mockProjectSpecs);
    // initialContent.current = specs;
    // setContent(prev => prev !== specs ? specs : prev);
  }, [projectId]);

  useEffect(() => {
    if (original)
      setAdditionalButtons(
        <button key="reset" onClick={() => {
          setContent(original);
          setOriginal(undefined);
        }}>
          <MdRestore />
        </button>
      )
    else
      setAdditionalButtons(null);
  }, [original, setAdditionalButtons])

  return (
    <div>
      <ContentEditor
        editorHeight='81vh'
        langType="yaml"
        content={_content}
        original={original}
        handleContentChange={(value) => setContent(value || "")}
      />
      <div className="absolute bottom-0 w-full bg-white z-20">
        <ImageChatInput
          onSend={onSubmit}
          sendOnEmpty={true}
          placeholder="Your issues, leave empty if none"
        />
      </div>
    </div>
  );
};
