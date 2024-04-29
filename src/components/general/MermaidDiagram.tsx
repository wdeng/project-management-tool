import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  diagram: string;
}

mermaid.initialize({
  securityLevel: 'loose'
});

// https://github.com/mermaid-js/mermaid/issues/3227
// use `if (await mermaid.parse(txt))` to validate the diagram
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ diagram }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaidRef.current.removeAttribute('data-processed');
      // mermaid.init(undefined, mermaidRef.current);
      mermaid.contentLoaded();
    }
  }, [diagram]);

  return (
    <div ref={mermaidRef} className="mermaid p-4">
      {diagram}
    </div>
  );
};

export default MermaidDiagram;
