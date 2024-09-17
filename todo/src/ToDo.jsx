import { useState, useEffect } from "react";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskList from "./TaskList";
import {getToDoTasks} from "./api.js";
import { v4 as uuid } from 'uuid'

const clientId = uuid();
let responseClientId = "";

const TodoApp = () => {
    const [list, setList] = useState([]);
    const stompClient = useStompClient();

    useEffect(() => {
        const savedList = localStorage.getItem("todoListTasks");
        if (savedList && savedList.length > 0) {
            setList(JSON.parse(savedList));
            console.log("Fetched from localStorage");
        } else {
            console.log("Fetched from server");
            fetchTasks();
        }
    }, []);

    function saveToLocalStorage(json) {
        console.log("Saving to localStorage");
        if (list && list.length > 0) {
            if(json){
                localStorage.setItem("todoListTasks", json);
            }else{
                localStorage.setItem("todoListTasks", JSON.stringify(list));
            }
        }
    }

    useSubscription("/topic/todos", (message) => {
        const response = JSON.parse(message.body);

        responseClientId = response.id;
        setList(response.list);

        saveToLocalStorage();
    });

    const publishReorder = async (startIndex, endIndex) => {
        if (startIndex === endIndex) return;

        const reorder = { clientId, startIndex, endIndex };

        if (stompClient) {
            await stompClient.publish({
                destination: "/app/reorder",
                body: JSON.stringify(reorder),
            });
        }
    };

    async function publishTask() {
        const description = document.getElementById("task-input").value;
        if (!description) return;

        if (stompClient) {
            await stompClient.publish({
                destination: "/app/add",
                body: JSON.stringify({ id: clientId, description }),
            });
        }else{
            console.log("no stompClient")
        }

    }

    async function onDragEnd(result) {
        const { destination, source } = result;

        if (!destination) return;

        await publishReorder(source.index, destination.index);
    }

    async function fetchTasks() {
        const list = await getToDoTasks();
        setList(list);
        saveToLocalStorage();
    }

    async function publishCompleted(taskId) {
        if (stompClient) {
            await stompClient.publish({
                destination: "/app/complete/" + taskId + "/" + clientId,
            });
        }
    }

    return (
        <div className="todo-list-container">
            <h2>ToDo List</h2>

            <div className="task-container">
                <input type="text" id="task-input" placeholder="Enter new task here..." />
                <button type="button" id="add-task" onClick={publishTask}> Add </button>
                <button type="button" id="sync-task" onClick={fetchTasks}>
                    Sync
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`droppable-list ${snapshot.isDraggingOver ? "is-dragging-over" : ""}`}
                        >
                            <TaskList tasks={list} publishCompleted={publishCompleted} id={clientId} responseId={responseClientId} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default TodoApp;
