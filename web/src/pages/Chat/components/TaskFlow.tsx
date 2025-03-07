import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useChatStore } from "../../../stores/chatStore";
import { useDroppable, useDraggable, DndContext } from "@dnd-kit/core";

interface Task {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed";
}

const TaskCard = ({ task }: { task: Task }) => {
  const { setNodeRef, attributes, listeners, transform } = useDraggable({ id: task.id });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        border: `2px solid ${getBorderColor(task.status)}`,
        borderRadius: 2,
        p: 2,
        minWidth: 120,
        textAlign: "center",
        cursor: "grab",
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "none",
        transition: "transform 0.2s ease",
      }}
    >
      <Typography variant="body2">{task.name}</Typography>
      {task.status === "processing" && <CircularProgress size={20} />}
    </Box>
  );
};

const getBorderColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#ff9800"; // 橙色 (待处理)
    case "processing":
      return "#2196f3"; // 蓝色 (处理中)
    case "completed":
      return "#4caf50"; // 绿色 (完成)
    default:
      return "#ccc";
  }
};

const TaskFlow = () => {
  const { tasks, updateTaskStatus } = useChatStore();

  // 检查 tasks 是否为 undefined 或空数组
  if (!tasks || tasks.length === 0) {
    return <Box sx={{ p: 2 }}>暂无任务流信息。</Box>;
  }

  return (
    <DndContext onDragEnd={(event) => updateTaskStatus(event.active.id, event.over?.id)}>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", p: 2 }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </DndContext>
  );
};

export default TaskFlow;