---
applyTo: "**/*refactor*,**/*extract*,**/*rename*,**/*inline*"
---

# Refactoring Patterns Skill

> Safe code transformations that improve structure without changing behavior.

## The Golden Rule

> **Tests pass before AND after. Same behavior, better structure.**

## When to Refactor

| Trigger | Action |
| ------- | ------ |
| Adding feature is hard | Refactor first, then add |
| Same bug twice | Refactor to prevent third |
| Code review feedback | Refactor before merge |
| "I don't understand this" | Refactor for clarity |

## When NOT to Refactor

- Under time pressure without tests
- Code that works and won't change
- Right before a release
- When you should rewrite instead

## Core Refactoring Moves

### Extract Function

```typescript
// Before
function processOrder(order: Order) {
    // 50 lines of validation
    // 30 lines of calculation
    // 20 lines of persistence
}

// After
function processOrder(order: Order) {
    validateOrder(order);
    const total = calculateTotal(order);
    persistOrder(order, total);
}
```

**When**: Function does too many things.

### Inline Function

```typescript
// Before
function isAdult(age: number) { return age >= 18; }
function canVote(person: Person) { return isAdult(person.age); }

// After
function canVote(person: Person) { return person.age >= 18; }
```

**When**: Function body is as clear as the name.

### Extract Variable

```typescript
// Before
if (order.total > 100 && order.customer.loyaltyYears > 2 && !order.hasDiscount) {

// After
const isLargeOrder = order.total > 100;
const isLoyalCustomer = order.customer.loyaltyYears > 2;
const eligibleForDiscount = isLargeOrder && isLoyalCustomer && !order.hasDiscount;
if (eligibleForDiscount) {
```

**When**: Expression is complex or used multiple times.

### Rename

```typescript
// Before
const d = new Date();
function calc(x: number, y: number) { ... }

// After
const orderDate = new Date();
function calculateShippingCost(weight: number, distance: number) { ... }
```

**When**: Name doesn't reveal intent.

### Replace Conditional with Polymorphism

```typescript
// Before
function getSpeed(vehicle: Vehicle) {
    switch (vehicle.type) {
        case 'car': return vehicle.enginePower * 2;
        case 'bike': return vehicle.pedalRate * 0.5;
        case 'plane': return vehicle.thrust * 10;
    }
}

// After
interface Vehicle { getSpeed(): number; }
class Car implements Vehicle { getSpeed() { return this.enginePower * 2; } }
class Bike implements Vehicle { getSpeed() { return this.pedalRate * 0.5; } }
```

**When**: Same switch/if appears in multiple places.

### Move Function

```typescript
// Before: Function in wrong class
class Order {
    calculateShipping() { /* uses customer data */ }
}

// After: Function where data lives
class Customer {
    calculateShipping(order: Order) { /* uses this.address */ }
}
```

**When**: Function uses more data from another class.

## Refactor vs Rewrite Decision

| Refactor When | Rewrite When |
| ------------- | ------------ |
| Core logic is sound | Fundamental design is wrong |
| Tests exist | No tests and untestable |
| Incremental improvement works | Everything must change together |
| Team understands the code | No one understands it |
| <30% needs to change | >70% needs to change |

## Safe Refactoring Workflow

1. **Commit** current state
2. **Run tests** — all pass
3. **Make ONE small change**
4. **Run tests** — still pass
5. **Commit**
6. Repeat

## Code Smells → Refactoring

| Smell | Refactoring |
| ----- | ----------- |
| Long function | Extract Function |
| Long parameter list | Introduce Parameter Object |
| Duplicate code | Extract Function/Class |
| Feature envy | Move Function |
| Primitive obsession | Replace with Object |
| Large class | Extract Class |
| Shotgun surgery | Move Function, Inline Class |

## Synapses

See [synapses.json](synapses.json) for connections.
