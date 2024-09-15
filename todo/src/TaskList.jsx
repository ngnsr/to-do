import { useRef, useState, useLayoutEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TaskList = ({ tasks, publishCompleted }) => {
    const taskRefs = useRef({});
    const [prevBoundingBox, setPrevBoundingBox] = useState({});
    const [boundingBox, setBoundingBox] = useState({});
    // const nodeRef = useRef(null); // Створюємо реф для кожного елемента

    useLayoutEffect(() => {
        const newBoundingBox = {};
        tasks.forEach((task) => {
            const node = taskRefs.current[task.id];
            if (node) {
                const domRect = node.getBoundingClientRect();
                newBoundingBox[task.id] = domRect;
            }
        });
        setBoundingBox(newBoundingBox);
    }, [tasks]);

    useLayoutEffect(() => {

        tasks.forEach((task) => {
            const node = taskRefs.current[task.id];
            if (!node) return;

            const firstBox = prevBoundingBox[task.id];
            const lastBox = boundingBox[task.id];

            if (firstBox && lastBox) {
                const changeInX = firstBox.left - lastBox.left;
                const changeInY = firstBox.top - lastBox.top;

                if (changeInX || changeInY) {
                    requestAnimationFrame(() => {
                        node.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
                        node.style.transition = "transform 0s";

                        requestAnimationFrame(() => {
                            node.style.transform = "";
                            node.style.transition = "transform 500ms";
                        });
                    });
                }
            }
        });

        setPrevBoundingBox(boundingBox);
    }, [tasks, prevBoundingBox, boundingBox]);

    return (
        <Droppable droppableId="droppable">
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="todo-list-container"
                >
                    <TransitionGroup component={null}>
                        {tasks.map((task, index) => (
                            <CSSTransition
                                key={task.id}
                                timeout={500}
                                classNames="task"
                            >
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
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TaskList;
