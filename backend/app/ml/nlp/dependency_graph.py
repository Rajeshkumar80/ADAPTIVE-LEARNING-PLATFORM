"""
Topic Dependency Graph — models prerequisite relationships between topics.
"""

from typing import List, Dict, Set, Optional
from collections import defaultdict, deque


class TopicDependencyGraph:
    """
    Directed acyclic graph (DAG) representing topic prerequisites.
    Used to determine study order and identify knowledge gaps.
    """

    def __init__(self):
        self.graph: Dict[str, Set[str]] = defaultdict(set)  # topic -> prerequisites
        self.reverse_graph: Dict[str, Set[str]] = defaultdict(set)  # topic -> dependents

    def add_dependency(self, topic: str, prerequisite: str):
        """Add a prerequisite relationship: topic requires prerequisite."""
        self.graph[topic].add(prerequisite)
        self.reverse_graph[prerequisite].add(topic)

    def add_topic(self, topic: str):
        """Add a topic with no prerequisites."""
        if topic not in self.graph:
            self.graph[topic] = set()

    def get_prerequisites(self, topic: str) -> List[str]:
        """Get all direct prerequisites for a topic."""
        return list(self.graph.get(topic, set()))

    def get_all_prerequisites(self, topic: str) -> List[str]:
        """Get all transitive prerequisites (BFS)."""
        visited = set()
        queue = deque(self.graph.get(topic, set()))

        while queue:
            prereq = queue.popleft()
            if prereq not in visited:
                visited.add(prereq)
                queue.extend(self.graph.get(prereq, set()) - visited)

        return list(visited)

    def get_dependents(self, topic: str) -> List[str]:
        """Get topics that depend on this topic."""
        return list(self.reverse_graph.get(topic, set()))

    def topological_sort(self) -> List[str]:
        """
        Return topics in valid study order (prerequisites first).
        Uses Kahn's algorithm.
        """
        in_degree = defaultdict(int)
        all_topics = set(self.graph.keys())

        for topic, prereqs in self.graph.items():
            for prereq in prereqs:
                in_degree[topic] += 1
                all_topics.add(prereq)

        # Start with topics that have no prerequisites
        queue = deque([t for t in all_topics if in_degree[t] == 0])
        result = []

        while queue:
            topic = queue.popleft()
            result.append(topic)

            for dependent in self.reverse_graph.get(topic, set()):
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    queue.append(dependent)

        return result

    def check_prerequisites_met(
        self, topic: str, mastered_topics: Set[str]
    ) -> Dict:
        """
        Check if a student has met all prerequisites for a topic.

        Returns:
            Dict with 'ready', 'missing_prerequisites', 'progress'
        """
        prereqs = self.get_all_prerequisites(topic)
        if not prereqs:
            return {"ready": True, "missing_prerequisites": [], "progress": 100}

        missing = [p for p in prereqs if p not in mastered_topics]
        progress = ((len(prereqs) - len(missing)) / len(prereqs)) * 100

        return {
            "ready": len(missing) == 0,
            "missing_prerequisites": missing,
            "progress": round(progress, 1),
        }

    def suggest_next_topics(
        self, mastered_topics: Set[str], limit: int = 5
    ) -> List[str]:
        """Suggest next topics to study based on current mastery."""
        suggestions = []

        for topic in self.topological_sort():
            if topic in mastered_topics:
                continue

            prereqs = self.graph.get(topic, set())
            if prereqs.issubset(mastered_topics):
                suggestions.append(topic)
                if len(suggestions) >= limit:
                    break

        return suggestions

    def to_dict(self) -> Dict:
        """Export graph as a serializable dict."""
        return {
            "nodes": list(set(self.graph.keys()) | set(self.reverse_graph.keys())),
            "edges": [
                {"from": prereq, "to": topic}
                for topic, prereqs in self.graph.items()
                for prereq in prereqs
            ],
        }


# Default CS topic dependencies
def build_cs_dependency_graph() -> TopicDependencyGraph:
    """Build a default dependency graph for CS topics."""
    g = TopicDependencyGraph()

    # DSA dependencies
    g.add_dependency("Linked Lists", "Arrays & Strings")
    g.add_dependency("Trees & Graphs", "Linked Lists")
    g.add_dependency("Dynamic Programming", "Arrays & Strings")
    g.add_dependency("Dynamic Programming", "Trees & Graphs")

    # DBMS dependencies
    g.add_dependency("Normalization", "SQL Queries")
    g.add_dependency("Transactions", "SQL Queries")
    g.add_dependency("Indexing", "SQL Queries")

    # OS dependencies
    g.add_dependency("Process Scheduling", "Process Management")
    g.add_dependency("Deadlocks", "Process Scheduling")
    g.add_dependency("Memory Management", "Process Management")
    g.add_dependency("Virtual Memory", "Memory Management")

    return g
