import {createRef, useEffect, useRef, useState} from "react";
import {getToDoTasks} from "./api";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {TransitionGroup, CSSTransition} from "react-transition-group";

function ToDoList() {

    /*
        TODO:
        css
        trancientgroup
    */

    // to fix error, line above just ignore
    // Run this in your terminal: npm install @hello-pangea/dnd or yarn add @hello-pangea/dnd
    // Replace all import { ... } from "react-beautiful-dnd" statements across all of your components with import { ... } from "@hello-pangea/dnd" statements.

    const [list, setList] = useState([]);
    const nodeRefs = useRef({});

    const stompClient = useStompClient();

    const error = console.error;
    console.error = (...args) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };

    useEffect(() => {
        const savedList = localStorage.getItem("todoListTasks");
        if (savedList && savedList.length > 0) {
            setList(JSON.parse(savedList));
            console.log("from useEffect");
            console.log("fetched from localstorage");
        } else {
            console.log("fetched from server");
        }
    }, []);

    function saveToLocalStorage() {
        console.log("save localstorage");
        if (list.length > 0) {
            localStorage.setItem("todoListTasks", JSON.stringify(list));
        }
    }

    useSubscription("/topic/todos", (message) => {
        const newList = JSON.parse(message.body);
        if(newList === list) return;

        setList(newList);

        saveToLocalStorage();
    });

    const publishReorder = async (startIndex, endIndex) => {
        if (startIndex === endIndex) return;

        const reorder = {startIndex, endIndex};

        if (stompClient) {
            await stompClient.publish({
                destination: "/app/reorder",
                body: JSON.stringify(reorder)
            })
        }
    }

    async function addTask() {
        const description = document.getElementById("task-input").value;

        if (description == null || description === "") return;
        if (stompClient) {
            await stompClient.publish({
                destination: "/app/add",
                body: JSON.stringify({description})
            });
        }
    }

    async function onDragEnd(result) {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        // const updatedList = Array.from(list);
        // const [movedItem] = updatedList.splice(source.index, 1);
        // updatedList.splice(destination.index, 0, movedItem);

        await publishReorder(
            source.index,
            destination.index
        );
    }

    async function fetchTasks() {
        const list = await getToDoTasks();

        setList(list);
        saveToLocalStorage();
    }

    async function publishCompleted(taskId) {
        if (stompClient) {
            await stompClient.publish({
                destination: "/app/complete/" + taskId
            })
        }
    }

    const getNodeRef = (id) => {
        if (!nodeRefs.current[id]) {
            nodeRefs.current[id] = createRef();  // Create ref if it doesn't exist
        }
        return nodeRefs.current[id];
    };

    return (
        <div className="center-container">
            <h2>ToDo List</h2>

            <div className="task-container">
                <input type="text" id="task-input" placeholder="Enter new task here..."/>
                <button type="button" id="add-task" onClick={addTask}>Add</button>
                <button type="button" id="sync-task" onClick={fetchTasks}>Sync</button>
            </div>

            <div className="todo-list-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps} ref={provided.innerRef}
                                className={`droppable-list ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                            >
                                <TransitionGroup component={null}>
                                    {list.map((task, index) => (
                                                // <CSSTransition key={index} nodeRef={getNodeRef(task.id)} timeout={500} classNames="task">
                                                <CSSTransition key={task.id} timeout={500} classNames="task">
                                                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`draggable-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                            >
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`task-checkbox${task.id}`}
                                                                        value={task.id}
                                                                        checked={task.completed}
                                                                        onChange={() => publishCompleted(task.id)}
                                                                    />
                                                                    {task.description}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </CSSTransition>
                                        )
                                    )}
                                </TransitionGroup>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

export default ToDoList
