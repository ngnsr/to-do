import { useRef, useState, useLayoutEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import TaskItem from "./TaskItem.jsx";

const TaskList = ({ tasks, publishCompleted, id, responseId }) => {
    const taskRefs = useRef({});
    const [prevBoundingBox, setPrevBoundingBox] = useState({});
    const [boundingBox, setBoundingBox] = useState({});

    useLayoutEffect(() => {
        const newBoundingBox = {};
        if(!tasks) return;

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
        if (id === responseId) return;
        if(!tasks) return;

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
    }, [tasks, prevBoundingBox, boundingBox, id, responseId]);

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
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    publishCompleted={publishCompleted}
                                    taskRefs={taskRefs}
                                />
                            </CSSTransition>
                        )) }
                    </TransitionGroup>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TaskList;
