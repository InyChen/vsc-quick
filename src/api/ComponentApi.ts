import http from "../lib/Request";

export class ComponentApi {

    public static async addComponent(component: any): Promise<boolean> {
        console.log("啛啛喳喳错");
        const rs = await http.post("component/add_component", component);
        console.log(rs);
        if (rs.status === 200) {
            return true;
        } else {
            return false;
        }
    }
}