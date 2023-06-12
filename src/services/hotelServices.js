import apiClient from "./services";

export default {
  getHotels() {
    return apiClient.get("hotels");
  },
  getHotelsByUserId(userId) {
    return apiClient.get("hotels/user/" + userId);
  },
  getHotel(id) {
    return apiClient.get("hotels/" + id);
  },
  addHotel(destination) {
    return apiClient.post("hotels", destination);
  },
  updateHotel(destinationId, destination) {
    return apiClient.put("hotels/" + destinationId, destination);
  },
  deleteHotel(destinationId) {
    return apiClient.delete("hotels/" + destinationId);
  },
};
