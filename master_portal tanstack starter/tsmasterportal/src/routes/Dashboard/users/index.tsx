import { createFileRoute } from "@tanstack/react-router";
import { UserList } from "../../../feature/usermanagement/userlist";

export const Route = createFileRoute("/Dashboard/users/")({
  component: UserList,
});