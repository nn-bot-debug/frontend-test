package ua.kazmirchuk;

class Node<T> {
    public T data;
    public Node<T> next;
}

class TwoThirdsOfLinkedList {

    public <T> Node<T> getTwoThirdsNode(Node<T> head) {
        if (head == null || head.next == null)
            return null;

        int n = 0;
        Node<T> current = head;
        while (current != null) {
            n++;
            current = current.next;
        }

        int position = (2 * n / 3) - 1;

        current = head;
        for (int i = 0; i < position; i++) {
            current = current.next;
        }
        return current;
    }
}
