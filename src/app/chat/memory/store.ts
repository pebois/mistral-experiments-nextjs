import { DataStore } from '@/lib/datastore'
import { create } from 'zustand'

export interface Entity {
  name: string
  observations: string[]
  type: string
}

export interface Relation {
  from: string
  to: string
  type: string
}

export interface KnowledgeGraph {
  entities: Entity[]
  relations: Relation[]
}

export interface Observation {
  entity_name: string
  contents: string[]
}

interface MemoryStore {
  add_observations: (args: { observations: Observation[] }) => Promise<void>
  connect: () => Promise<void>
  connected: boolean
  create_entities: (args: { entities: Entity[] }) => Promise<void>
  create_relations: (args: { relations: Relation[] }) => Promise<void>
  delete_entities: (args: { entities: string[] }) => Promise<void>
  delete_observations: (args: { observations: Observation[] }) => Promise<void>
  delete_relations: (args: { relations: Relation[] }) => Promise<void>
  open_nodes: (args: { names: string[] }) => Promise<KnowledgeGraph>
  read_graph: () => Promise<KnowledgeGraph>
  search_nodes: (args: { query: string }) => Promise<KnowledgeGraph>
}

export const useMemoryStore = create<MemoryStore>((set) => {
  const store = new DataStore({
    database: 'memory',
    stores: [{
      key: { keyPath: 'name' },
      name: 'entity',
    }, {
      key: { keyPath: [ 'from', 'to', 'type' ] },
      name: 'relation',
    }],
    version: 1,
  })
  return ({
    connect: async () => {
      await store.connect()
      return set(() => ({ connected: true }))
    },
    connected: false,
    add_observations: async (args) => {
      for (const observation of args.observations) {
        const entity = await store.get<Entity>('entity', observation.entity_name)
        entity.observations.push(...observation.contents)
        await store.update<Entity>('entity', entity)
      }
    },
    delete_observations: async (args) => {
      for (const observation of args.observations) {
        const entity = await store.get<Entity>('entity', observation.entity_name)
        entity.observations = entity.observations.filter((o) => !observation.contents.includes(o))
        await store.update<Entity>('entity', entity)
      }
    },
    create_entities: async (args) => {
      for (const entity of args.entities) {
        await store.add<Entity>('entity', entity)
      }
    },
    create_relations: async (args) => {
      for (const relation of args.relations) {
        await store.add<Relation>('relation', relation)
      }
    },
    delete_entities: async (args) => {
      for (const relation of await store.all<Relation>('relation')) {
        if (
          args.entities.includes(relation.from) ||
          args.entities.includes(relation.to)
        ) {
          await store.delete('relation', [ relation.from, relation.to, relation.type ])
        }
      }
      for (const entity of args.entities) {
        await store.delete('entity', entity)
      }
    },
    delete_relations: async (args) => {
      for (const relation of args.relations) {
        await store.delete('relation', [ relation.from, relation.to, relation.type ])
      }
    },
    read_graph: async () => {
      const entities = await store.all<Entity>('entity')
      const relations = await store.all<Relation>('relation')
      return {
        entities,
        relations,
      }
    },
    search_nodes: async (args) => {
      const regexp = new RegExp(args.query, 'i')
      const entities = await store.all<Entity>('entity')
      const relations = await store.all<Relation>('relation')
      return {
        entities: entities.filter((entity) => (
          entity.name.match(regexp) ||
          entity.type.match(regexp) ||
          entity.observations.some((observation) => observation.match(regexp))
        )),
        relations: relations.filter((relation) => (
          relation.from.match(regexp) ||
          relation.to.match(regexp) ||
          relation.type.match(regexp)
        )),
      }
    },
    open_nodes: async (args) => {
      const entities = await store.all<Entity>('entity')
      const relations = await store.all<Relation>('relation')
      return {
        entities: entities.filter((entity) => (
          args.names.includes(entity.name)
        )),
        relations: relations.filter((relation) => (
          args.names.includes(relation.from) ||
          args.names.includes(relation.to)
        )),
      }
    },
  })
})
