const Node = require('./LinkedListNode.js');

class LinkedList{
    constructor(){
	this.head = null;
    }
}
LinkedList.prototype.insertAtEnd = function(data){
    //Create a node Object that will be appended at the end of the list.
    let newNode = new Node(data);
    //If there is no Nodes currenly in the linked list.
    if(!this.head){
	this.head = newNode;
    }else{
	let current = this.head;
	while(current.next != null){
	    current = current.next;
	}
	current.next = newNode;
    }
}
LinkedList.prototype.print = function(){
    let current = this.head
    console.log(this.head.data);
    while(current.next != null){
	current = current.next;
	console.log(current.data);
    }

}
LinkedList.prototype.getHead = function(){
    return this.head.data;
}
module.exports = LinkedList;
