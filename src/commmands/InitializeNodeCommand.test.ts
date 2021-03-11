import NetworkAdapterService from "../services/NetworkAdapterService";
import InitializeNodeCommand from "./InitializeNodeCommand";

const networkAdapterService = new NetworkAdapterService();
const initializeNodeCommand = new InitializeNodeCommand({networkAdapterService})
initializeNodeCommand.execute();
