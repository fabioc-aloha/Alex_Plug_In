---
name: ado-integration
description: Work with Azure DevOps for work items, repos, pipelines, and boards. Use when user asks about ADO, work items, builds, or pipelines.


# Azure DevOps Integration

Work with Azure DevOps services.

## Work Items

### Query Work Items
```
@workspace Find all open bugs assigned to me
```

### Create Work Item
```
@workspace Create a bug for [description]
```

### Update Work Item
```
@workspace Update work item 12345 to In Progress
```

## Repositories

### PR Operations
```
@workspace Create a PR from feature/xyz to main
```

### Branch Management
```
@workspace List recent branches
```

## Pipelines

### Pipeline Status
```
@workspace What's the status of the main build?
```

### Trigger Pipeline
```
@workspace Run the deployment pipeline
```

## Boards

### Sprint Queries
```
@workspace What's in the current sprint?
```

### Backlog
```
@workspace Show the product backlog
```

## WIQL Examples

```sql
SELECT [System.Id], [System.Title], [System.State]
FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'Bug'
  AND [System.State] = 'Active'
ORDER BY [Microsoft.VSTS.Common.Priority]
```
