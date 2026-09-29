import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import { Button } from "@workspace/ui/components/button"


function RouteComponent() {
  return (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse>Hello, world!</MessageResponse>
        <Home></Home>
        <Example></Example>
        <BasicExample></BasicExample>
        <ChatInput></ChatInput>
      </MessageContent>
    </Message>
  );
}

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>

      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </div>
  )
}



import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@workspace/ui/components/ai-elements/attachments";
import { nanoid } from "nanoid";
import { memo, useCallback, useState } from "react";

const initialAttachments = [
  {
    filename: "mountain-landscape.jpg",
    id: nanoid(),
    mediaType: "image/jpeg",
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    filename: "ocean-sunset.jpg",
    id: nanoid(),
    mediaType: "image/jpeg",
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
  },
  {
    filename: "document.pdf",
    id: nanoid(),
    mediaType: "application/pdf",
    type: "file" as const,
    url: "",
  },
  {
    filename: "video.mp4",
    id: nanoid(),
    mediaType: "video/mp4",
    type: "file" as const,
    url: "",
  },
];

interface AttachmentItemProps {
  attachment: (typeof initialAttachments)[0];
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

function Example() {
  const [attachments, setAttachments] = useState(initialAttachments);

  const handleRemove = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div className="flex items-center justify-center p-8">
      <Attachments variant="grid">
        {attachments.map((attachment) => (
          <AttachmentItem
            attachment={attachment}
            key={attachment.id}
            onRemove={handleRemove}
          />
        ))}
      </Attachments>
    </div>
  );
};




import { PromptArea } from '@workspace/ui/components/prompt-area/prompt-area'
import { usePromptAreaState } from '@workspace/ui/components/prompt-area/use-prompt-area-state'

function ChatInput() {
  const { bind, plainText, isEmpty, clear } = usePromptAreaState()

  function handleSubmit() {
    if (isEmpty) return
    clear()
  }

  return (
    <PromptArea
      {...bind}
      placeholder="Ask anything…"
      onSubmit={handleSubmit}
      autoGrow
      minHeight={48}
    />
  )
}



function BasicExample() {
  const [segments, setSegments] = useState<any[]>([])
  return (
    <PromptArea
      value={segments}
      onChange={setSegments}
      placeholder="Just a text input with Enter to submit..."
      onSubmit={() => { setSegments([]) }}
      minHeight={48}
    />
  )
}