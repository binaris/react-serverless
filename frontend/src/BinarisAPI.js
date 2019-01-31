import urljoin from 'url-join';

function CORSOptions(itemData) {
  const options = {
    method: 'POST',
    mode: 'cors',
  };
  if (itemData) {
    options.body = JSON.stringify(itemData);
    options.headers = { 'Content-Type': 'application/json' };
  }
  return options;
}

class BinarisAPI {
  constructor(rootEndpoint) {
    this.createEndpoint = urljoin(rootEndpoint, 'public_create_endpoint');
    this.readEndpoint = urljoin(rootEndpoint, 'public_read_endpoint');
    this.updateEndpoint = urljoin(rootEndpoint, 'public_update_endpoint');
    this.deleteEndpoint = urljoin(rootEndpoint, 'public_delete_endpoint');
  }

  async createItem(item) {
    const res = await fetch(this.createEndpoint, CORSOptions({ message: item }));
    return res.json();
  }

  async readAllItems() {
    const res = await fetch(this.readEndpoint, CORSOptions());
    return res.json();
  }

  async updateItem(itemID, item) {
    const mergeData = {
      message: item,
      id: itemID,
    };
    const res = await fetch(this.updateEndpoint, CORSOptions(mergeData));
    return res.json();
  }

  async deleteItem(itemID) {
    await fetch(this.deleteEndpoint, CORSOptions({ id: itemID }));
  }
}

export default BinarisAPI;
