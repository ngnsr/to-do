import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ task, index, publishCompleted, taskRefs }) => {

    return (
        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
            {(provided) => (
                <div
                    ref={(node) => {
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
    );
};

export default TaskItem;
