import http from "../lib/Request";

export class ProjectApi {

    public static async loadMyProjects(): Promise<[]> {
        const rs = await http.get("project/load_my_projects");
        if (rs.status === 200) {
            return rs.payload;
        } else {
            return [];
        }
    }

    public static async loadProjectComponents(projectId: any): Promise<[]> {
        const rs = await http.get("project/load_project_components?project_id=" + projectId);
        if (rs.status === 200) {
            return rs.payload;
        } else {
            return [];
        }
    }
}