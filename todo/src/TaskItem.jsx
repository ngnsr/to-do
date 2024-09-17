import { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CSSTransition } from 'react-transition-group';

const TaskItem = ({ task, index, publishCompleted, taskRefs }) => {
    const nodeRef = taskRefs.current[task.id] || useRef(null); // Перевіряємо наявність рефа для поточного task.id

    return (
        <CSSTransition
            key={task.id}
            nodeRef={nodeRef}
            timeout={500}
            classNames="task"
        >
            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                    <div
                        ref={(node) => {
                            nodeRef.current = node;
                            taskRefs.current[task.id] = node;
                            provided.innerRef(node);
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-item"
                    >
                        <div className="task-item">
                            <input
                                type="checkbox"
                                id={`task-checkbox${task.id}`}
                                value={task.id}
                                checked={task.completed}
                                onChange={() => publishCompleted(task.id)}
                            />
                            <label htmlFor={`task-checkbox${task.id}`}>
                                {task.description}
                            </label>
                        </div>
                    </div>
                )}
            </Draggable>
        </CSSTransition>
    );
};

export default TaskItem;
